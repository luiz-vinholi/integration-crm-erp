const { OrderRepository } = require('../../infrastructure/repositories/orders/order.repository')

/**
 * Get orders with filters and pagination.
 *
 * @param {{ page: number, limit: number }} pagination
 * @param {OrderRepository} _orderRepository - Order repository injection
 */
module.exports.getOrders = async (
  pagination,
  _orderRepository = new OrderRepository()
) => {
  const orders = await _orderRepository.getOrders(pagination)
  return orders
}
