/* eslint-disable no-console */
const { Types } = require('mongoose')
const Product = require('../models/product.model')
const clientEs = require('../db/elasticsearch')

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find()
    res.send(products)
  } catch (error) {
    console.log(error.message)
    res.status(500).end()
  }
}

exports.getProductById = async (req, res) => {
  try {
    const id = Types.ObjectId(req.params.id)
    const product = await Product.findById(id)
    res.send(product)
  } catch (error) {
    console.log(error.message)
    res.status(500).end()
  }
}

exports.getProductBySlug = async (req, res) => {
  try {
    const { slug: slugUrl } = req.params

    if (slugUrl !== undefined) {
      const product = await Product.findOne({ slug: slugUrl })

      if (product) {
        res.send(product)
      }
    }
  } catch (error) {
    console.log(error.message)
  }
}

exports.getProductsFromES = async (req, res) => {
  try {
    const { body } = await clientEs.search({
      index: 'products',
      size: 10000,
      body: {
        query: {
          match_all: {}
        }
      }
    })

    res.send(body.hits.hits.map(val => val._source))
  } catch (error) {
    console.log(error.message)
  }
}
