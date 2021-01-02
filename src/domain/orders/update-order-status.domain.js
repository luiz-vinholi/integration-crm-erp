const { OrderStatusEnum } = require('../../common/enums/order-status.enum')
const { ErpOrderStatusEnum } = require('../../common/enums/erp-order-status.enum')
const { OrderErpRepository } = require('../../infrastructure/repositories/erp/order-erp.repository')
const { OrderRepository } = require('../../infrastructure/repositories/orders/order.repository')

/**
 * Update order status in ERP api and database by erpId.
 *
 * @param {ObjectID} id - Order id to update.
 * @param {{
 *   erpId: string,
 *   status: OrderStatusEnum
 * }} orderData
 * @param {OrderErpRepository} _orderErpRepository - Order erp repository injection.
 * @param {OrderRepository} _orderRepository - Order Repository inejction.
 */
module.exports.updateOrderStatus = async (
  id,
  orderData,
  _orderErpRepository = new OrderErpRepository(),
  _orderRepository = new OrderRepository()
) => {
  const orderErpStatus = {
    [OrderStatusEnum.OPENED]: ErpOrderStatusEnum.OPENED,
    [OrderStatusEnum.FINISHED]: ErpOrderStatusEnum.ATTENDED,
    [OrderStatusEnum.CANCELED]: ErpOrderStatusEnum.CANCELED
  }[orderData.status]
  await _orderErpRepository.updateOrderStatus(orderData.erpId, orderErpStatus)
  await _orderRepository.updateOrderStatus(id, orderData.status)
}
