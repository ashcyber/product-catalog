/* eslint-disable no-console */
require('./db/index')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const config = require('../nuxt.config.js')
const productRoutes = require('./routes/product.routes')
const app = express()

app.use('/api', productRoutes)
// Express Config
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

config.dev = process.env.NODE_ENV !== 'production'

async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
