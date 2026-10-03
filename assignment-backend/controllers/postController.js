const Post = require('../models/Post');
const postService = require('../services/postService');
const { postSchema } = require('../utils/validators');

// @desc    Get all posts (with pagination)
// @route   GET /api/posts
const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // Delegated to Service Layer
    const result = await postService.getPaginatedPosts(page, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get post by slug
// @route   GET /api/posts/slug/:slug
const getPostBySlug = async (req, res) => {
  try {
    // Delegated to Service Layer
    const post = await postService.getPostBySlug(req.params.slug);
      
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a post
// @route   POST /api/posts
const createPost = async (req, res) => {
  try {
    const validatedData = postSchema.parse(req.body);
    
    // Delegated to Service Layer
    const populatedPost = await postService.createPost({
      title: validatedData.title,
      content: validatedData.content,
      author: req.user._id
    });
    
    res.status(201).json(populatedPost);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post || post.isDeleted) return res.status(404).json({ message: 'Post not found' });
    
    // Check permission (owner or admin)
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized to update this post' });
    }
    
    const validatedData = postSchema.parse(req.body);
    
    post.title = validatedData.title;
    post.content = validatedData.content;
    // Keeping slug unchanged so external links don't break
    
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a post (soft delete)
// @route   DELETE /api/posts/:id
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post || post.isDeleted) return res.status(404).json({ message: 'Post not found' });
    
    // Check permission
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized to delete this post' });
    }
    
    post.isDeleted = true;
    await post.save();
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPosts, getPostBySlug, createPost, updatePost, deletePost };
