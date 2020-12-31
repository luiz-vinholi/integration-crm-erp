const { Schema, model } = require('../database')

const clientSubSchema = new Schema({
  name: {
    type: String,
    required: true
  }
}, {
  _id: false
})

const orderSchema = new Schema({
  crmId: {
    type: String,
    required: true
  },
  erpId: {
    type: String,
    required: true
  },
  client: {
    type: clientSubSchema,
    required: true
  },
  productId: {
    type: Schema.Types.ObjectID,
    ref: 'Products',
    required: true
  },
  value: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
})

module.exports.OrderModel = model('Orders', orderSchema)
