import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import { checkUsageLimit } from './middleware/usageMiddleware.js';

dotenv.config();

async function runTests() {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/resume-app';
    await mongoose.connect(mongoURI);
    console.log('Connected to DB at', mongoURI);

    // 1. Create a dummy test user
    const testEmail = `verify_limit_${Date.now()}@test.com`;
    const user = await User.create({
        name: 'Verify User',
        email: testEmail,
        password: 'password123',
        plan: 'free',
        usage: { count: 3, lastResetMonth: new Date().getMonth() }
    });

    console.log('Created Free User with 3/3 usage.');

    // 2. Simulate Middleware
    user.save = async function () { return this; }; // Mock save
    const req = { user: user };
    const res = {
        status: function (code) {
            this.statusCode = code;
            return this;
        },
        json: function (data) {
            this.data = data;
            return this;
        }
    };
    const next = () => { console.log('✅ Limit passed! (Next called)'); return true; };

    console.log('\nTest 1: Check blocked free user');
    await checkUsageLimit(req, res, next);
    if (res.statusCode === 403) {
        console.log('✅ Pass: User blocked as expected.');
        console.log('Message:', res.data.message);
    } else {
        console.error('❌ Fail: User was not blocked.');
    }

    console.log('\nTest 2: Check month rollover');
    req.user.usage.lastResetMonth = (new Date().getMonth() - 1 + 12) % 12;
    await checkUsageLimit(req, res, next);
    if (req.user.usage.count === 0) {
        console.log('✅ Pass: Usage reset correctly for new month.');
    } else {
        console.error('❌ Fail: Usage did not reset.');
    }

    console.log('\nTest 3: Check premium user');
    req.user.plan = 'premium';
    req.user.usage.count = 50; // High usage
    const premiumResult = await checkUsageLimit(req, res, next);
    if (premiumResult === true) {
        console.log('✅ Pass: Premium user allowed unlimited access.');
    } else {
        console.error('❌ Fail: Premium user blocked.');
    }

    // Cleanup
    await User.deleteOne({ _id: user._id });
    await mongoose.disconnect();
}

runTests().catch(console.error);
