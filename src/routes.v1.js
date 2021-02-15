const { Router } = require('express')
const adminAuth = require('./middlewares/roleManager')('admin')
const {
  getLatestPosts,
  getPostsByTags,
  getPostById,
  createPost,
  removePost,
  updatePost,
} = require('./controller')

const v1 = Router()

// GET METHODS
v1.get('/post/latest', getLatestPosts)
v1.get('/post/id/:id', getPostById)
v1.get('/post/tags?', getPostsByTags)

// POST METHODS
v1.post('/post/admin', [adminAuth], createPost)

// PUT/PATCH METHODS
v1.patch('/post/admin/:id', [adminAuth], updatePost)

// DELETE METHODS
v1.delete('/post/admin/:id', [adminAuth], removePost)

module.exports = v1
