const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { commentSchema } = require('../utils/validators');

// @desc    Get comments for a post
// @route   GET /api/comments/post/:postId
const getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
      
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a comment
// @route   POST /api/comments
const createComment = async (req, res) => {
  try {
    const validatedData = commentSchema.parse(req.body);
    
    // Check if post exists
    const postExists = await Post.findById(validatedData.postId);
    if (!postExists || postExists.isDeleted) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = await Comment.create({
      content: validatedData.content,
      author: req.user._id,
      post: validatedData.postId
    });
    
    const populatedComment = await Comment.findById(comment._id).populate('author', 'name email');
    res.status(201).json(populatedComment);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    
    // Check ownership or admin status
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized to delete this comment' });
    }
    
    await comment.deleteOne();
    res.json({ message: 'Comment removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCommentsByPost, createComment, deleteComment };
