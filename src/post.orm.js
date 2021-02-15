const PostModel = require('./models/post.model')

/**
 * This class has basic manages of post,
 * it's of public access, use it for client with readonly permisson
 *
 * NOTE: All getters method from this class filtring post docs by status:'public'
 */
class Post {
  /**
   * This method search and return found post by id,
   * if id is not defined it throw a Error, else return false, ese
   * if not found post document if has been found
   * @param {string} id
   * @return {boolean | object}
   */
  async getPostById(id = null) {
    if (!id) throw new Error('Cannot get post by undefind id')
    const foundPost = await PostModel.findOne(
      { publicId: id, status: 'public' },
      { _id: 0, __v: 0, 'Indicative.Present._id': 0 }
    ).exec()
    if (!foundPost) return false
    return foundPost
  }

  /**
   * Filter post by tags
   * @param {*} tags
   * @returns {Array<object> | boolean}
   */
  async getPostByTags(tags = []) {
    if (tags.length < 1) throw new Error('Cannot get posts by undefinde tags')
    const foundPosts = await PostModel.find(
      { tags: { $in: tags }, status: 'public' },
      { _id: 0, __v: 0, 'Indicative.Present._id': 0 }
    ).exec()
    if (foundPosts.length < 1) return false
    return foundPosts
  }

  /**
   * Return last added posts, by default limit at 5 docs,
   * but can use limit param to custom it
   * @param {number} limit
   * @returns {Array<object> | boolean}
   */
  async getLatestPosts(limit = 5) {
    const foundPosts = await PostModel.find({ status: 'public' }).sort({ _id: -1 }).limit(limit)
    if (foundPosts.length < 1 || Object.keys(foundPosts).length < 1) return false
    return foundPosts.map((post) => {
      // Hide mongodb id
      const { title, description, tags, publicId, content } = post
      return { title, description, tags, publicId, content }
    })
  }
}

/**
 * This class is for post administration,
 * has sensible actions like delete or update, it most
 * use with admin authentification
 */
class PostAdmin extends Post {
  async createPost({ title, description, tags, content } = {}) {
    if (title && description && content && typeof tags == 'object') {
      const newPost = new PostModel({
        title,
        description,
        content,
        tags,
      })
      await newPost.save()
      return true
    }
    throw new Error('Cannot add new post, check if data is valide')
  }

  /**
   *
   * @param {string} id
   * @returns {boolean} true if post deleted else return false
   */
  async deletePost(id = null) {
    if (!id) throw new Error('cannot remove post without reference id')
    const result = await PostModel.remove({ publicId: id }).exec()
    if (!result) return false
    return true
  }

  /**
   *
   * @param {string} id
   * @param {object} updates
   * @returns {boolean} true if post updated else return false
   */
  async updatePost(id = null, updates = {}) {
    if (!id) throw new Error('cannot update post without reference id')
    if (Object.keys(updates).length < 1)
      throw new Error('Cannot update post form empty update object')
    const result = await PostModel.updateOne({ publicId: id }, updates).exec()
    if (!result) return false
    return true
  }

  /**
   *
   * @param {string} status
   * @param {string} id
   * @returns {boolean} true if status has been updated, else return false
   */
  async updatePostStatus(status = null, id = null) {
    if (!status || !id) return false
    await PostModel.updateOne({ publicId: id }, { status }).exec()
    return true
  }

  /**
   * This method return all posts in database (don't filter by status)
   */
  async getAllPosts() {
    const result = PostModel.find().exec()
    if (result.length < 1) return false
    return result
  }
}

module.exports = {
  Post,
  PostAdmin,
}
