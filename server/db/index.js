/* eslint-disable no-console */
const mongoose = require('mongoose')
const { mongoURI } = require('../config/keys')

mongoose.connect(mongoURI, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true, poolSize: 50 })

const db = mongoose.connection

db.on('error', (error) => {
  console.error(error)
})

db.once('open', () => {
  console.log('Database connection is open!')
})

module.exports = db
