const express = require('express');
const router = express.Router();
const { getPosts, getPostBySlug, createPost, updatePost, deletePost } = require('../controllers/postController');
const { protect } = require('../middlewares/auth');

router.route('/')
  .get(getPosts)
  .post(protect, createPost);

router.get('/slug/:slug', getPostBySlug); // Use /slug/:slug to avoid conflict with /:id

router.route('/:id')
  .put(protect, updatePost)
  .delete(protect, deletePost);

module.exports = router;
