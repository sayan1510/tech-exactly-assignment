const Post = require('../models/Post');

/**
 * Service Layer for Post operations
 * Separating business logic from controllers ensures a cleaner architecture (Phase 8).
 */
class PostService {
  
  // Get all active posts with pagination
  async getPaginatedPosts(page, limit) {
    const startIndex = (page - 1) * limit;
    const query = { isDeleted: false };
    
    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    return {
      data: posts,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) }
    };
  }

  // Get a single post by its slug
  async getPostBySlug(slug) {
    return await Post.findOne({ slug, isDeleted: false }).populate('author', 'name email');
  }

  // Create a new post
  async createPost(postData) {
    const post = await Post.create(postData);
    return await Post.findById(post._id).populate('author', 'name email');
  }
}

module.exports = new PostService();
