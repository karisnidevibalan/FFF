import mongoose from 'mongoose';

const accessRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    companyName: {
        type: String,
        required: [true, 'Please provide the company name you represent'],
        trim: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    adminComment: {
        type: String, // Reason for rejection or notes
    },
    requestedDate: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('AccessRequest', accessRequestSchema);
