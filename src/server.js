const App = require('./app')
const { connectToMongodb } = require('./db')
const PORT = App.get('port')
App.listen(PORT, () => {
  console.log(`Express app running in: http://localhost:${PORT}/`)
})

// CONE
connectToMongodb()
