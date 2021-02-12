const App = require('./app')
const { connectToMongodb } = require('./db')
const PORT = App.get('port')
App.listen(App.get(PORT), () => {
  console.log(`Express app running in: htpp://localhost:${PORT}/`)
})

// CONE
connectToMongodb()
