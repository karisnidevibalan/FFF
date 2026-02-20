import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Compare multiple candidates (Recruiter Only)
router.post('/compare', protect, authorize('recruiter'), async (req, res) => {
    try {
        const { candidates } = req.body; // Array of resume analysis results

        // Simple logic to sort candidates by match score
        const ranked = [...candidates].sort((a, b) => b.matchScore - a.matchScore);

        res.json({
            success: true,
            data: ranked
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Rank candidates for a specific company (B2B)
router.post('/rank', protect, authorize('recruiter'), async (req, res) => {
    try {
        const { jobTitle, candidates } = req.body;

        // Filter candidates belonging to the same companyId if applicable
        const companyCandidates = candidates.filter(c => c.companyId === req.user.companyId);

        const ranked = companyCandidates.sort((a, b) => b.atsScore - a.atsScore);

        res.json({
            success: true,
            data: ranked,
            jobTitle
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
