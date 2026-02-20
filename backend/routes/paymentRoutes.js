import express from 'express';
import Stripe from 'stripe';
import User from '../models/User.js';
import Company from '../models/Company.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Payment Intent
router.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount } = req.body;

        // Ensure valid amount (min 50 INR)
        if (!amount || amount < 1) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to paise
            currency: 'inr',
            payment_method_types: ['card'],
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Stripe Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Verify Individual Premium Payment
router.post('/verify-payment', async (req, res) => {
    try {
        const { paymentIntentId, userId } = req.body;
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            await User.findByIdAndUpdate(userId, {
                isPremium: true,
                plan: 'premium'
            });
            res.json({ success: true, message: 'Payment verified, user upgraded.' });
        } else {
            res.status(400).json({ success: false, message: 'Payment not successful' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Verify Agency Payment (B2B Upgrade)
router.post('/verify-agency-payment', protect, async (req, res) => {
    try {
        const { paymentIntentId, planName, amount } = req.body;
        const user = req.user;

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            // 1. Create Company for User (if not exists)
            // Use user's name as company name default, they can change later
            let companyName = `${user.name}'s Agency`;

            // Check if user already linked? If so update plan
            let company;
            if (user.companyId) {
                // If companyId is an object ID, use it. If it was string from old schema, might break. 
                // We cleaned schema so should be ok if empty.
                if (user.companyId && user.companyId.toString().length > 10) {
                    company = await Company.findById(user.companyId);
                }
            }

            if (!company) {
                // Determine limits based on plan
                let maxUsers = 5;
                if (planName === 'Growth') maxUsers = 10;
                if (planName === 'Enterprise') maxUsers = 50;

                // Create unique name mechanism
                const timestamp = new Date().getTime();
                company = await Company.create({
                    name: `${companyName} ${timestamp}`, // Ensure unique
                    verificationStatus: 'verified', // Auto-verify paid users
                    plan: 'b2b',
                    maxUsers
                });
            }

            // 2. Upgrade User
            user.role = 'recruiter';
            user.plan = 'b2b';
            user.companyId = company._id;
            user.isPremium = true;
            await user.save();

            res.json({ success: true, message: 'Agency plan activated.', company });
        } else {
            res.status(400).json({ success: false, message: 'Payment not successful' });
        }
    } catch (error) {
        console.error('Agency verification error:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
