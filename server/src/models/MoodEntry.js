import mongoose from 'mongoose';

const moodEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  moodLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  emotions: [{
    type: String
  }],
  notes: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('MoodEntry', moodEntrySchema);
