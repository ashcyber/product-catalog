/* eslint-disable no-console */
require('../db/index')

const fs = require('fs')
const path = require('path')
const rawData = fs.readFileSync(path.join(__dirname, 'PRODUCTS.json'))
const products = JSON.parse(rawData).products
const faker = require('faker')

function getRandomArbitrary (min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

const Product = require('../models/product.model');

(async () => {
  // Clear All Products
  await Product.deleteMany({})
    .then(() => {
      console.log('1 - All products cleared')
    })
    .catch((err) => {
      console.log(err.message)
    })

  const productsArr = products.map((prod) => {
    return {
      name: prod.name,
      description: prod.description ? prod.description : faker.lorem.sentence(),
      price: getRandomArbitrary(500, 10000),
      title_tags: prod.title_tags ? prod.title_tags : '',
      image: prod.images ? prod.images : 'https://www.wilddesignz.com/image/cache/catalog/placeholderproduct-500x500.png',
      color: faker.commerce.color(),
      slug: prod.name
        .trim()
        .split(' ')
        .join('-')
        .toLowerCase()
    }
  })

  await Product.insertMany(productsArr)
    .then(() => {
      console.log('Products Data Loaded')
    })
    .catch((error) => {
      console.log(error.message)
    })
})()
