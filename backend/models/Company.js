import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a company name'],
        unique: true,
        trim: true,
    },
    verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending',
    },
    plan: {
        type: String,
        enum: ['b2b', 'enterprise'],
        default: 'b2b',
    },
    maxUsers: {
        type: Number,
        default: 5, // Default usage limit for resume uploads/analyses per month for the company
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Company', companySchema);
