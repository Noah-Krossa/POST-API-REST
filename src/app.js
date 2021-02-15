const Express = require('express')
const Cors = require('cors')
const Helmet = require('helmet')
const Logger = require('morgan')
const { join } = require('path')
const CookieParser = require('cookie-parser')

/** ENV CONFIG */
require('dotenv').config()

const App = Express()

/**  Middlewares  */
App.use(Cors())
App.use(Helmet())
App.use(CookieParser(process.env.SECRET_COOKIE))
App.use(Express.urlencoded({ extended: false }))
App.use(Express.json())
App.use(Logger('dev'))

/** Routing */
App.use('/api', require('./routes.v1'))

/** APP SETTINGS */
App.use(Express.static(join(__dirname, 'public')))
App.set('port', process.env.PORT)

module.exports = App
