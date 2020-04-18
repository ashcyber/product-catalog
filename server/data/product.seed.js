/* eslint-disable no-console */
require('../db/index')

const fs = require('fs')
const path = require('path')
const rawData = fs.readFileSync(path.join(__dirname, 'PRODUCTS.json'))
const products = JSON.parse(rawData).products

function getRandomArbitrary (min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

const Product = require('../models/product.model')

const categories = ['Cameras', 'Party', 'Electronics']
const vendors = ['GBR', 'AST', 'RPC']

;(async () => {
  // Clear All Products
  await Product.deleteMany({})
    .then(() => {
      console.log('1 - All products cleared')
    })
    .catch((err) => {
      console.log(err.message)
    })

  const productsArr = products.map((prod) => {
    if (prod.images && prod.description) {
      return {
        name: prod.name,
        description: prod.description,
        price: getRandomArbitrary(500, 10000),
        image: prod.images,
        vendor: vendors[Math.floor(Math.random() * vendors.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        slug: prod.name
          .trim()
          .split(' ')
          .join('-')
          .toLowerCase()
      }
    }
  }).filter(val => val !== undefined)
  await Product.insertMany(productsArr)
    .then(() => {
      console.log('Products Data Loaded')
    })
    .catch((error) => {
      console.log(error.message)
    })
})()
