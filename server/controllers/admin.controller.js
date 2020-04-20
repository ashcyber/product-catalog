/* eslint-disable */
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Admin = require('../models/admin.model')
const Product = require('../models/product.model')
const isEmpty = require('../validators/isEmpty')
const client = require('../db/elasticsearch')

exports.adminLogin = async (req, res) => {
  try {
    const user = {
      email: req.body.email,
      password: req.body.password
    }

    if(isEmpty(user.email) || isEmpty(user.password)) 
       throw new Error('Input fields are empty')

    let resAdmin = await Admin.findOne({email: user.email})

    if(isEmpty(resAdmin)) {
        throw new Error('User does not exists')
    }

    bcrypt.compare(user.password, resAdmin.password, (err, result) => {
        if (err) {
            res.status(500).send(err.message)
        }
        if (result) {
          jwt.sign({ data: resAdmin }, process.env.SECRET_OR_KEY, (err, token) => {
            if (err) {
              throw new Error(err)
            }

            res.json({ token })
          })
        }
        else {
            res.status(500).send('Password is incorrect')
        }
      })
  } catch (err) {
      res.status(500).send(err.message)
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

exports.addProduct = async (req, res) => {
  try {
    let body = req.body;
    let mongoRes = await Product.create(body)
    if(mongoRes){
      let esresponse = await client.index({
          index: 'products', 
          refresh: true, 
          body:  { 
            ...body  
          }
      })
      if(esresponse){
        res.send('success')
      }
    }
  }
  catch(err) {
    console.log(err.message)
    res.status(500).end()
  }
}