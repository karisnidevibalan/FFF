import express from 'express';
import { protect } from '../middleware/auth.js';
import AccessRequest from '../models/AccessRequest.js';

const router = express.Router();

// Request Recruiter Access
router.post('/request-access', protect, async (req, res) => {
    try {
        const { companyName } = req.body;

        if (!companyName) {
            return res.status(400).json({ success: false, message: 'Please provide a company name' });
        }

        // Check if request already exists
        const existingRequest = await AccessRequest.findOne({
            userId: req.user._id,
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({ success: false, message: 'You already have a pending request' });
        }

        // Create Request
        const request = await AccessRequest.create({
            userId: req.user._id,
            companyName
        });

        res.status(201).json({
            success: true,
            message: 'Access request submitted successfully. Pending admin approval.',
            data: request
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
