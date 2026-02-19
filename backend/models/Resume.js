import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    default: 'My Resume',
    required: true,
  },
  template: {
    type: String,
    enum: ['modern', 'classic', 'creative', 'minimal', 'professional'],
    default: 'modern',
  },
  personalInfo: {
    fullName: String,
    email: String,
    phone: String,
    location: String,
    professionalSummary: String,
    profileImage: String,
  },
  experience: [
    {
      jobTitle: String,
      company: String,
      location: String,
      startDate: Date,
      endDate: Date,
      currentlyWorking: Boolean,
      description: String,
    },
  ],
  education: [
    {
      schoolName: String,
      degree: String,
      field: String,
      startDate: Date,
      endDate: Date,
      description: String,
    },
  ],
  skills: [
    {
      name: String,
      level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      },
    },
  ],
  projects: [
    {
      projectName: String,
      description: String,
      technologies: [String],
      link: String,
      startDate: Date,
      endDate: Date,
    },
  ],
  certifications: [
    {
      certificationName: String,
      issuer: String,
      issueDate: Date,
      expiryDate: Date,
      credentialId: String,
      credentialLink: String,
    },
  ],
  languages: [
    {
      language: String,
      proficiency: {
        type: String,
        enum: ['elementary', 'limited', 'professional', 'fluent', 'native'],
      },
    },
  ],
  atsScore: Number,
  // Sharing features
  shareId: {
    type: String,
    unique: true,
    sparse: true,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  // Analytics
  analytics: {
    totalViews: { type: Number, default: 0 },
    totalDownloads: { type: Number, default: 0 },
    totalShares: { type: Number, default: 0 },
    viewHistory: [{
      date: Date,
      count: Number,
      country: String,
      source: String,
    }],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
