const { postSchema, commentSchema } = require('../utils/validators');

describe('Validation Schemas (Unit Tests)', () => {
  describe('postSchema', () => {
    it('should validate a correct post payload', () => {
      const validPost = { title: 'My valid title', content: 'This is my valid content string.' };
      expect(() => postSchema.parse(validPost)).not.toThrow();
    });

    it('should throw error if title is too short', () => {
      const invalidPost = { title: 'ab', content: 'This is my valid content string.' };
      expect(() => postSchema.parse(invalidPost)).toThrow();
    });
  });

  describe('commentSchema', () => {
    it('should validate a correct comment payload', () => {
      const validComment = { content: 'Great post!', postId: '650a2b4f' };
      expect(() => commentSchema.parse(validComment)).not.toThrow();
    });
  });
});
