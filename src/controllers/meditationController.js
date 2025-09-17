import MeditationSession from '../models/MeditationSession.js';

export const createMeditationSession = async (req, res) => {
  try {
    const { sessionType, durationMinutes, completed, notes } = req.body;
    const userId = req.user._id;

    const session = new MeditationSession({
      userId,
      sessionType,
      durationMinutes,
      completed: completed || false,
      notes
    });

    await session.save();

    res.status(201).json({
      message: 'Meditation session created successfully',
      session
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMeditationSessions = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 10, page = 1 } = req.query;

    const sessions = await MeditationSession.find({ userId })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateMeditationSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { sessionType, durationMinutes, completed, notes } = req.body;
    const userId = req.user._id;

    const session = await MeditationSession.findOneAndUpdate(
      { _id: id, userId },
      { sessionType, durationMinutes, completed, notes },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ error: 'Meditation session not found' });
    }

    res.json({
      message: 'Meditation session updated successfully',
      session
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMeditationSession = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const session = await MeditationSession.findOneAndDelete({ _id: id, userId });

    if (!session) {
      return res.status(404).json({ error: 'Meditation session not found' });
    }

    res.json({ message: 'Meditation session deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSessionStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await MeditationSession.aggregate([
      { $match: { userId, completed: true } },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          totalMinutes: { $sum: '$durationMinutes' },
          avgDuration: { $avg: '$durationMinutes' }
        }
      }
    ]);

    res.json(stats[0] || { totalSessions: 0, totalMinutes: 0, avgDuration: 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
