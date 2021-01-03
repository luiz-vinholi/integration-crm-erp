const { Schema, model, models } = require('../database')
const { OrderStatusEnum } = require('../../common/enums/order-status.enum')

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
  title: {
    type: String,
    required: true
  },
  client: {
    type: clientSubSchema,
    required: true
  },
  product: {
    type: Schema.Types.ObjectID,
    ref: 'Products',
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: [
      OrderStatusEnum.FINISHED,
      OrderStatusEnum.OPENED,
      OrderStatusEnum.CANCELED
    ]
  }
}, {
  timestamps: true
})

const OrderModel = models.Orders || model('Orders', orderSchema)
module.exports = { OrderModel }
