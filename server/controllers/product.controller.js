/* eslint-disable no-console */
const { Types } = require('mongoose')
const ExcelJS = require('exceljs')
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

exports.getProductStats = async (req, res) => {
  try {
    const { body } = await clientEs.search({
      index: 'products',
      size: 0,
      body: {
        aggs: {
          category_bucket: {
            terms: { field: 'category' },
            aggs: {
              price_stats: {
                stats: {
                  field: 'price'
                }
              }
            }
          }
        }
      }
    })

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Product Stats')

    worksheet.columns = [
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Min Price', key: 'min', width: 20 },
      { header: 'Max Price', key: 'max', width: 20 },
      { header: 'Avg Price', key: 'avg', width: 20 },
      { header: 'Count of Items', key: 'count', width: 20 }
    ]

    const buckets = body.aggregations.category_bucket.buckets

    buckets.map((row) => {
      worksheet.addRow({
        category: row.key,
        min: row.price_stats.min,
        max: row.price_stats.max,
        avg: row.price_stats.avg.toFixed(2),
        count: row.price_stats.count
      })
    })

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', 'attachment; filename=' + 'Product_stats.xlsx')

    await workbook.xlsx.write(res)
    res.end()
  } catch (error) {
    console.log(error)
  }
}
