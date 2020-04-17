/* eslint-disable no-console */
require('./db/index')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const productRoutes = require('./routes/product.routes')

const PORT = process.env.PORT || 3000
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.use('/api', productRoutes)

app.listen(PORT, () => {
  console.log(`Listening to ${PORT}`)
})
