const { z } = require('zod');

const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(150, "Title is too long"),
  content: z.string().min(10, "Content must be at least 10 characters")
});

const commentSchema = z.object({
  content: z.string().min(2, "Comment is too short"),
  postId: z.string() // Need the post ID to attach the comment
});

module.exports = { postSchema, commentSchema };
