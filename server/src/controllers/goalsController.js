import WellnessGoal from '../models/WellnessGoal.js';

export const createWellnessGoal = async (req, res) => {
  try {
    const { title, description, targetFrequency } = req.body;
    const userId = req.user._id;

    const goal = new WellnessGoal({
      userId,
      title,
      description,
      targetFrequency: targetFrequency || 1
    });

    await goal.save();

    res.status(201).json({
      message: 'Wellness goal created successfully',
      goal
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getWellnessGoals = async (req, res) => {
  try {
    const userId = req.user._id;

    const goals = await WellnessGoal.find({ userId })
      .sort({ createdAt: -1 });

    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateWellnessGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, targetFrequency, currentStreak, isCompleted } = req.body;
    const userId = req.user._id;

    const goal = await WellnessGoal.findOneAndUpdate(
      { _id: id, userId },
      { title, description, targetFrequency, currentStreak, isCompleted },
      { new: true }
    );

    if (!goal) {
      return res.status(404).json({ error: 'Wellness goal not found' });
    }

    res.json({
      message: 'Wellness goal updated successfully',
      goal
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteWellnessGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const goal = await WellnessGoal.findOneAndDelete({ _id: id, userId });

    if (!goal) {
      return res.status(404).json({ error: 'Wellness goal not found' });
    }

    res.json({ message: 'Wellness goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const incrementStreak = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const goal = await WellnessGoal.findOneAndUpdate(
      { _id: id, userId },
      { $inc: { currentStreak: 1 } },
      { new: true }
    );

    if (!goal) {
      return res.status(404).json({ error: 'Wellness goal not found' });
    }

    res.json({
      message: 'Streak incremented successfully',
      goal
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
