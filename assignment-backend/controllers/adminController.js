const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments({ isDeleted: false });
    const totalComments = await Comment.countDocuments();

    // Fetch lists for management
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    const posts = await Post.find().populate('author', 'name email').sort({ createdAt: -1 });

    res.json({
      stats: {
        totalUsers,
        totalPosts,
        totalComments
      },
      users,
      posts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
