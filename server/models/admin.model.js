const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'udated_at' } }
)

module.exports = mongoose.model('Admin', adminSchema)
