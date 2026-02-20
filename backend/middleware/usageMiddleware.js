import User from '../models/User.js';

export const checkUsageLimit = async (req, res, next) => {
    try {
        const user = req.user;
        const currentMonth = new Date().getMonth();

        // 1. Check for Month Rollover & Reset
        if (user.usage.lastResetMonth !== currentMonth) {
            user.usage.count = 0;
            user.usage.lastResetMonth = currentMonth;
            await user.save();
        }

        // 2. Check Plan Limits
        if (user.plan === 'premium' || user.plan === 'b2b') {
            return next(); // Unlimited
        }

        if (user.plan === 'free') {
            // Temporary increase for testing
            if (user.usage.count >= 100) {
                return res.status(403).json({
                    success: false,
                    message: 'Monthly limit of 3 free analyses reached. Please upgrade to Premium for unlimited access.',
                    limitReached: true
                });
            }
            return next();
        }

        next();
    } catch (error) {
        console.error('Usage Middleware Error:', error);
        res.status(500).json({ success: false, message: 'Server error checking usage limits' });
    }
};

export const trackUsage = async (userId) => {
    try {
        await User.findByIdAndUpdate(userId, {
            $inc: { 'usage.count': 1 }
        });
    } catch (error) {
        console.error('Failed to track usage:', error);
    }
};
