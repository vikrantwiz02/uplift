import CommunityPost from '../models/CommunityPost.js';

export const createCommunityPost = async (req, res) => {
  try {
    const { title, content, category, isAnonymous } = req.body;
    const userId = req.user._id;

    const post = new CommunityPost({
      userId,
      title,
      content,
      category: category || 'general',
      isAnonymous: isAnonymous || false
    });

    await post.save();

    res.status(201).json({
      message: 'Community post created successfully',
      post
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCommunityPosts = async (req, res) => {
  try {
    const { category, limit = 10, page = 1 } = req.query;
    
    const filter = {};
    if (category && category !== 'all') {
      filter.category = category;
    }

    const posts = await CommunityPost.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('userId', 'name username');

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCommunityPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;
    const userId = req.user._id;

    const post = await CommunityPost.findOneAndUpdate(
      { _id: id, userId },
      { title, content, category },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ error: 'Community post not found' });
    }

    res.json({
      message: 'Community post updated successfully',
      post
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCommunityPost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await CommunityPost.findOneAndDelete({ _id: id, userId });

    if (!post) {
      return res.status(404).json({ error: 'Community post not found' });
    }

    res.json({ message: 'Community post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const likeCommunityPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await CommunityPost.findByIdAndUpdate(
      id,
      { $inc: { likesCount: 1 } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ error: 'Community post not found' });
    }

    res.json({
      message: 'Post liked successfully',
      post
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCommunityPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await CommunityPost.findById(id)
      .populate('userId', 'name username');

    if (!post) {
      return res.status(404).json({ error: 'Community post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
