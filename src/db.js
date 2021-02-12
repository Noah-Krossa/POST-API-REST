const { connect, set } = require('mongoose')

const MONGODB_LOCAL_URI = 'mongodb://localhost:27017/dev_db'

/** MONGODB SETTINGS */
set('useNewUrlParser', true)
set('useUnifiedTopology', true)

/**
 * Connect to mongodb database, this func return false if
 * something wrong and string message if connected successfuly
 * @return {string|false}
 */
const connectToMongodb = async () => {
  try {
    // Connecting to development db
    if (process.env.MODE === 'development') {
      await connect(MONGODB_LOCAL_URI)
      console.log(`connected to mongodb locally via: ${MONGODB_LOCAL_URI}`)
      return
    }
    // Connecting to production db
    const USER = process.env.MONGODB_USER
    const PASSOWRD = process.env.MONGODB_PASSWORD
    const HOST = process.env.MONGODB_HOST
    const DB_NAME = process.env.MONGODB_DB_NAME
    const PORT = process.env.MONGODB_PORT
    const MONGODB_URI = `mongodb://${USER}:${PASSOWRD}@${HOST}:${PORT}/${DB_NAME}`
    await connect(MONGODB_URI)
    console('Connected to mongodb successfuly!')
  } catch (e) {
    console.log('Cannot connect to mongodb database')
    console.log(e)
    return false
  }
}

module.exports = { connectToMongodb }
