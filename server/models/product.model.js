const mongoose = require('mongoose')
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    image: {
      type: String
    },
    slug: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    category: {
      type: String
    },
    keywords: {
      type: Array
    },
    color: {
      type: String
    },
    description: String
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)
module.exports = mongoose.model('Product', productSchema)
