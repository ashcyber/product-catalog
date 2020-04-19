/* eslint-disable */
require('dotenv').config()
require('./db/index')

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
// const consola = require('consola')
const isEmpty = require('./validators/isEmpty')
const { Nuxt, Builder } = require('nuxt')
const config = require('../nuxt.config.js')
const productRoutes = require('./routes/product.routes')
const app = express()
const bcrypt = require('bcrypt');

const Admin = require('./models/admin.model'); 

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use('/api', productRoutes)

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

app.post('/api/login', (req, res) => {
  try {
    const user = {
      email: req.body.email,
      password: req.body.password
    }

    Admin.findOne({email: user.email}, (err, data) => {
      bcrypt.compare(user.password, data.password, (err, result) => {
        if(err) { 
          throw Error('Password Does not match')
        }

        if(result){
          jwt.sign({data}, process.env.SECRET_OR_KEY ,(err, token) => {
            if(err) {
              console.log(err)
            }
  
            res.json({token})
          })
        }
      })
    })
  }
  catch(err) { 
    console.log(err.message)
    res.status(500).end()
  }
})


app.post('/api/access', verifyUser, (req, res) => {
  res.send('I am a restricted API')
})

function verifyUser(req, res, next) {
  try{
    const bearerHeader = req.headers['authorization']

    let token = bearerHeader.split('Bearer ')[1]
    
    if(isEmpty(bearerHeader) || isEmpty(token)) 
      throw Error('Token field is empty')
    
    jwt.verify(token.trim(), process.env.SECRET_OR_KEY ,(err, user) => {
      if(err) {
        throw Error('Error verifying the data')
      }

      Admin.findOne({email: user.data.email}, (err, userMongo) => {
        if(err) {
          throw Error('Email not found')
        }
        if(userMongo.password === user.data.password){
          return next()
        }
      })
    })
  }
  catch(err) {
    console.log(err.message)
    res.status(403).end()
  }
}


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
// start()
app.listen(3000, () => {
  consola.log('Server is up')
})