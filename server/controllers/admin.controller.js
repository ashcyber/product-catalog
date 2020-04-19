/* eslint-disable */
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Admin = require('../models/admin.model')
const isEmpty = require('../validators/isEmpty')

exports.adminLogin = (req, res) => {
  try {
    const user = {
      email: req.body.email,
      password: req.body.password
    }
    Admin.findOne({ email: user.email }, (err, data) => {
      bcrypt.compare(user.password, data.password, (err, result) => {
        if (err) {
          throw new Error('Password Does not match')
        }

        if (result) {
          jwt.sign({ data }, process.env.SECRET_OR_KEY, (err, token) => {
            if (err) {
              console.log(err)
            }

            res.json({ token })
          })
        }
      })
    })
  } catch (err) {
    console.log(err.message)
    res.status(500).end()
  }
}

exports.verifyUser  = (req, res, next) => {
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