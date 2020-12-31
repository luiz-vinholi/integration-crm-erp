const { OrderModel } = require('../../models/order.model')

class OrderRepository {
  constructor () {
    this.orderModel = OrderModel
  }

  /**
    Create order in database.

    @param {{
      crmId: string,
      erpId: string,
      client: {
        name: string
      },
      productId: ObjectID,
      value: number
    }} orderData
   */
  createOrder (orderData) {
    return this.orderModel.create(orderData)
  }

  /**
    Check if exists order in database by crmId.

    @param {string} crmId
    @returns {Promise<boolean>} true if exists and false if not exists.
   */
  checkIfExistsByCrmId (crmId) {
    return this.orderModel.exists({ crmId })
  }
}

module.exports = { OrderRepository }
