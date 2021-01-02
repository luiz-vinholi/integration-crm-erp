const { OrderModel } = require('../../models/order.model')
const { OrderStatusEnum } = require('../../../common/enums/order-status.enum')

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
   *  client: {
   *    name: string
   *  },
   *  productId: ObjectID,
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
   * Get orders with pagination.
   *
   * @param {{
   *  status: OrderStatusEnum,
   * }} filters - Query filters.
   * @param {{
   *  page: number,
   *  limit: number
   * }} pagination - Query pagination.
   */
  getOrders (
    filters,
    {
      page = 0,
      limit = 10
    }) {
    const status = filters.status || OrderStatusEnum.FINISHED
    const skip = page * limit
    return this.orderModel.find({ status })
      .populate('product')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: 'desc' })
      .lean()
  }
}

module.exports = { OrderRepository }
