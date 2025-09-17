import mongoose from 'mongoose';

const communityPostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    default: 'general',
    enum: ['general', 'anxiety', 'depression', 'mindfulness', 'self-care', 'success-stories', 'resources']
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  likesCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('CommunityPost', communityPostSchema);
