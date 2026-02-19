import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import User from '../models/User.js';

const router = express.Router();

// Initialize Razorpay
// Note: In production, these should be in environment variables
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_YourKeyHere',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'YourSecretHere',
});

// Get Razorpay Key ID
router.get('/key', (req, res) => {
    res.json({ key: process.env.RAZORPAY_KEY_ID });
});

// Create Order
router.post('/create-order', async (req, res) => {
    try {
        const { amount = 499 } = req.body;

        const options = {
            amount: amount * 100, // amount in paise
            currency: "INR",
            receipt: "receipt_" + Date.now(),
        };

        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(500).send("Error creating order");
        }

        res.json(order);
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).send("Error creating order");
    }
});

// Verify Payment
router.post('/verify-payment', async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            userId
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Update user premium status
            if (userId) {
                await User.findByIdAndUpdate(userId, { isPremium: true });
            }

            res.json({
                success: true,
                message: "Payment verified successfully"
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid payment signature"
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
