import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    minlength: 2,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false,
  },
  phone: {
    type: String,
    default: '',
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  },
  role: {
    type: String,
    enum: ['individual', 'candidate', 'recruiter', 'admin'],
    default: 'individual',
  },
  plan: {
    type: String,
    enum: ['free', 'premium', 'b2b'],
    default: 'free',
  },
  usage: {
    count: {
      type: Number,
      default: 0,
    },
    lastResetMonth: {
      type: Number,
      default: new Date().getMonth(),
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  googleId: {
    type: String,
    default: '',
  },
  photoURL: {
    type: String,
    default: '',
  },
});

const User = mongoose.model('User', userSchema);
export default User;
