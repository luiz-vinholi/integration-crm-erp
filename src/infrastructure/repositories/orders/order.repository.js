const { OrderModel } = require('../../models')

class OrderRepository {
  constructor () {
    this.orderModel = OrderModel
  }

  /**
   * Create order in database.
   *
   * @param {{
   *  crmId: string,
   *  erpId: string,
   *  title: string,
   *  client: {
   *    name: string
   *  },
   *  product: ObjectID,
   *  value: number,
   *  status: OrderStatusEnum
   * }} orderData
   */
  createOrder (orderData) {
    return this.orderModel.create(orderData)
  }

  /**
   * Update order status by order id.
   *
   * @param {ObjectID} id - Order id.
   * @param {OrderStatusEnum} status - Order status to update.
   */
  async updateOrderStatus (id, status) {
    await this.orderModel.updateOne(
      { _id: id },
      { $set: { status } }
    )
  }

  /**
   * Check if exists order in database by crmId.
   *
   * @param {string} crmId
   * @returns {Promise<boolean>} true if exists and false if not exists.
   */
  checkIfExistsByCrmId (crmId) {
    return this.orderModel.exists({ crmId })
  }

  /**
   * Get orders with pagination and total orders in dataase.
   *
   * @param {{
   *  page: number,
   *  limit: number
   * }} pagination - Query pagination.
   ( @returns - Orders and number of total orders in database.
   */
  async getOrders ({
    page = 0,
    limit = 10
  }) {
    const skip = page * limit
    const orders = await this.orderModel.find()
      .populate('product')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: 'desc' })
      .lean()
    const total = await this.orderModel.estimatedDocumentCount()
      .exec()
    return {
      total,
      currentPage: page,
      limit,
      orders
    }
  }
}

module.exports = { OrderRepository }
