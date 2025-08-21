import mongoose from 'mongoose';

const crisisResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String
  },
  websiteUrl: {
    type: String
  },
  country: {
    type: String,
    required: true,
    default: 'US'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('CrisisResource', crisisResourceSchema);
