const { OrderErpRepository } = require('../../infrastructure/repositories/erp/order-erp.repository')
const { OrderRepository } = require('../../infrastructure/repositories/orders/order.repository')
const { OrderStatusEnum } = require('../../common/enums/order-status.enum')

/**
 * Create order in ERP and insert in database.
 *
 * @param {{
 *   client: {
 *     id: string,
 *     name: string,
 *     erpId: string
 *   },
 *   product: {
 *     id: string,
 *     description: string,
 *     erpId: string
 *   },
 *   crmId: string,
 *   value: number
 * }} orderData
 * @param {OrderRepository} _orderRepository - Order repository injection.
 * @param {OrderErpRepository} _orderErpRepository - Order erp repository injection.
 */
module.exports.createOrder = async (
  orderData,
  _orderRepository = new OrderRepository(),
  _orderErpRepository = new OrderErpRepository()
) => {
  const itemDescription = `[${orderData.crmId}]${orderData.product.description}`
  const erpOrder = await _orderErpRepository.createOrder({
    client: {
      name: orderData.client.name
    },
    item: {
      code: orderData.product.erpId,
      description: itemDescription,
      unit_value: orderData.value,
      quantity: 1
    }
  })
  const order = await _orderRepository.createOrder({
    erpId: erpOrder.number,
    crmId: orderData.crmId,
    title: orderData.title,
    client: orderData.client,
    product: orderData.product.id,
    value: orderData.value,
    status: OrderStatusEnum.FINISHED
  })
  return order
}
