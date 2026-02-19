import express from 'express';
import Stripe from 'stripe';
import User from '../models/User.js';

const router = express.Router();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
});

// Create Payment Intent
router.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount = 499 } = req.body;

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // amount in cents/paise
            currency: "inr",
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                integration_check: 'accept_a_payment',
            },
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).json({ error: error.message });
    }
});

// Verify Payment and Update User
router.post('/verify-payment', async (req, res) => {
    try {
        const { paymentIntentId, userId } = req.body;

        if (!paymentIntentId || !userId) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Retrieve the PaymentIntent to verify status
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            // Payment is successful, update user
            await User.findByIdAndUpdate(userId, { isPremium: true });

            res.json({
                success: true,
                message: "Payment verified and premium activated"
            });
        } else {
            res.status(400).json({
                success: false,
                message: `Payment status is ${paymentIntent.status}`
            });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});

export default router;
