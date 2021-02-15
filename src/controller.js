const { Post, PostAdmin } = require('./post.orm')

const postAdminManager = new PostAdmin()
const postClientManager = new Post()

const getManager = (role) => {
  if (role === 'admin') return postAdminManager
  return postClientManager
}

const postController = {
  getPostById: async (req, res, next) => {
    const { role } = req
    const { id } = req.params
    try {
      const manager = getManager(role)
      const result = await manager.getPostById(id)
      if (!result) return res.status(404).json({ message: 'Not found post' })
      res.json({ post: result })
    } catch (e) {
      return next(e)
    }
  },

  getLatestPosts: async (req, res, next) => {
    try {
      const manager = getManager(req.role)
      let result = await manager.getLatestPosts()
      if (!result) return res.status(404).json({ message: 'Not found post' })
      res.json({ posts: result })
    } catch (e) {
      return next(e)
    }
  },

  getPostsByTags: async (req, res, next) => {
    try {
      const manager = await getManager(req.role)
      let { list: tags } = req.query
      if (!tags) throw new Error('cannot get post by undefind tags')
      tags = JSON.parse(tags)
      const result = await manager.getPostByTags(tags)
      if (!result) return res.status(404).json({ message: 'Not found post' })
      res.json({ posts: result })
    } catch (e) {
      return next(e)
    }
  },

  createPost: async (req, res, next) => {
    try {
      const { role, body } = req
      const { title, description, content, tags } = body
      if (role !== 'admin') return res.status(401).json({ message: 'not have create permission' })

      const result = await postAdminManager.createPost({ tags, title, description, content })

      if (!result) res.status(400).json({ message: 'Post create failed' })
      res.json({ message: 'One post has been created' })
    } catch (e) {
      return next(e)
    }
  },

  updatePost: async (req, res, next) => {
    try {
      const { role } = req
      const { id } = req.params
      const { body } = req
      if (role !== 'admin') return res.status(401).json({ message: 'not have update permission' })
      const result = await postAdminManager.updatePost(id, body)
      if (!result) res.status(400).json({ message: 'Post update failed' })
      res.json({ message: 'One post has been created' })
    } catch (e) {
      return next(e)
    }
  },

  removePost: async (req, res, next) => {
    try {
      const { role } = req
      const { id } = req.params
      if (role !== 'admin') return res.status(401).json({ message: 'not have delete permission' })
      const result = await postAdminManager.deletePost(id)
      if (!result) res.status(400).json({ message: 'Post remove failed' })
      res.json({ message: 'One post has been removed' })
    } catch (e) {
      return next(e)
    }
  },
}

module.exports = postController
