const { Schema, model } = require('mongoose')
const { generate } = require('short-uuid')

const POST_STATUS = ['pending', 'private', 'public']

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  publishDate: {
    type: Date,
    default: Date.now(),
  },
  publicId: {
    type: String,
    unique: true,
  },
  lastUpdate: {
    type: Date,
  },
  tags: {
    type: [String],
    max: 30,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: POST_STATUS,
  },
})

// Pre save
PostSchema.pre('save', function (done) {
  if (!this.publicId) this.publicId = generate()
  done()
})

module.exports = model('posts', PostSchema)
