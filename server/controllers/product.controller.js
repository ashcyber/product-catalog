/* eslint-disable no-console */
const { Types } = require('mongoose')
const Product = require('../models/product.model')
const clientEs = require('../db/elasticsearch')

function buildQuery (filters) {
  const query = {}

  query.bool = {}
  query.bool.must = []

  query.bool.must.push({ range: { price: { gte: filters.price[0], lte: filters.price[1] } } })
  if (filters.category.length > 0) {
    query.bool.must.push({ terms: { category: filters.category.map(val => val.toLowerCase()) } })
  }

  if (filters.vendor.length > 0) {
    query.bool.must.push({ terms: { vendor: filters.vendor.map(val => val.toLowerCase()) } })
  }

  // if (filters.search.length > 0) {
  //   query.bool.must.push({
  //     multi_match: {
  //       query: `*${filters.search}*`,
  //       fields: ['description', 'name']
  //     }
  //   })
  // }

  if (filters.search.length > 0) {
    query.bool.must.push({
      query_string: {
        query: `*${filters.search.toLowerCase()}*`,
        fields: ['name', 'description']
      }
    })
  }

  return query
}

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
    const query = buildQuery(req.body)
    const { body } = await clientEs.search({
      index: 'products',
      size: 10000,
      body: { query }
    })

    res.send(body.hits.hits.map(val => val._source))
  } catch (error) {
    console.log(error.message)
  }
}
