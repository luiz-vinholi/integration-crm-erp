const { OrderModel } = require('../../models/order.model')

class OrderRepository {
  createOrder (orderData) {
    return OrderModel.create(orderData)
  }
}

module.exports = { OrderRepository }
