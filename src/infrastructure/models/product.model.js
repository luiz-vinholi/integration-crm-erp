const { Schema, model, models } = require('../database')

const productSchema = new Schema({
  description: {
    type: String,
    required: true
  },
  erpId: {
    type: String,
    unique: true,
    required: true
  }
}, {
  timestamps: true
})

const ProductModel = models.Products || model('Products', productSchema)
module.exports = { ProductModel }
