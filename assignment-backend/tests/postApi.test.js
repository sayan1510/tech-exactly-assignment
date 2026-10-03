const request = require('supertest');
const express = require('express');
const postRoutes = require('../routes/postRoutes');

// Mock Express app for testing routes in isolation
const app = express();
app.use(express.json());
app.use('/api/posts', postRoutes);

// Mock the Service Layer to avoid actual DB calls during this integration test
jest.mock('../services/postService', () => ({
  getPaginatedPosts: jest.fn().mockResolvedValue({
    data: [{ title: 'Mock Post', content: 'Mock Content', slug: 'mock-post' }],
    pagination: { total: 1, page: 1, limit: 10, pages: 1 }
  })
}));

// We also need to mock the authentication middleware since we aren't testing auth here
jest.mock('../middlewares/auth', () => ({
  protect: (req, res, next) => next(),
  admin: (req, res, next) => next()
}));

describe('Post API Integration Tests', () => {
  it('GET /api/posts should return paginated posts from the service', async () => {
    const res = await request(app).get('/api/posts');
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].title).toBe('Mock Post');
  });
});
