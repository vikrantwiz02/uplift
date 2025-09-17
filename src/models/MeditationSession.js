import mongoose from 'mongoose';

const meditationSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionType: {
    type: String,
    required: true,
    enum: ['mindfulness', 'breathing', 'body-scan', 'loving-kindness']
  },
  durationMinutes: {
    type: Number,
    required: true,
    min: 1
  },
  completed: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('MeditationSession', meditationSessionSchema);
