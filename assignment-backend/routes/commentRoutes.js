const express = require('express');
const router = express.Router();
const { getCommentsByPost, createComment, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middlewares/auth');

router.get('/post/:postId', getCommentsByPost);
router.post('/', protect, createComment);
router.delete('/:id', protect, deleteComment);

module.exports = router;
