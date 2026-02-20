import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import User from '../models/User.js';
import Company from '../models/Company.js';
import AccessRequest from '../models/AccessRequest.js';

const router = express.Router();

// Get all pending access requests
router.get('/access-requests', protect, authorize('admin'), async (req, res) => {
    try {
        const requests = await AccessRequest.find({ status: 'pending' })
            .populate('userId', 'name email')
            .sort({ requestedDate: -1 });
        res.json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Approve an access request
router.post('/approve-access/:requestId', protect, authorize('admin'), async (req, res) => {
    try {
        const request = await AccessRequest.findById(req.params.requestId);
        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Request already processed' });
        }

        const user = await User.findById(request.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // 1. Check if company exists, or create new
        let company = await Company.findOne({ name: request.companyName });
        if (!company) {
            company = await Company.create({
                name: request.companyName,
                verificationStatus: 'verified', // Auto-verify for now
                plan: 'b2b'
            });
        }

        // 2. Update User
        user.role = 'recruiter';
        user.plan = 'b2b';
        user.companyId = company._id;
        await user.save();

        // 3. Update Request Status
        request.status = 'approved';
        await request.save();

        res.json({ success: true, message: 'Access approved. User is now a Recruiter.', company });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Reject an access request
router.post('/reject-access/:requestId', protect, authorize('admin'), async (req, res) => {
    try {
        const { reason } = req.body;
        const request = await AccessRequest.findById(req.params.requestId);

        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        request.status = 'rejected';
        request.adminComment = reason || 'Requirements not met';
        await request.save();

        res.json({ success: true, message: 'Access request rejected' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
