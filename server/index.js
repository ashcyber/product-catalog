/* eslint-disable */
require('dotenv').config()
require('./db/index')

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { Nuxt, Builder } = require('nuxt')
const config = require('../nuxt.config.js')

const productRoutes = require('./routes/product.routes')
const adminRoutes = require('./routes/admin.routes')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.use('/api', productRoutes)
app.use('/api', adminRoutes)

/*
app.post('/api/create-user', (req,res) => {
  const user = {
    email: "admin@gmail.com", 
    password: 'admin'
  }

  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash; 
      Admin.create(user);
      res.send(user)
    })
  })
})
*/

config.dev = process.env.NODE_ENV !== 'production'

async function start () {
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  await nuxt.ready()

  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.use(nuxt.render)

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
// app.listen(3000, () => {
//   console.log('Server is up')
// })