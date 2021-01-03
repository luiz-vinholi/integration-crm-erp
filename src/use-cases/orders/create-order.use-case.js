const { OrderDomain } = require('../../domain/orders')
const { ProductDomain } = require('../../domain/products')

/**
 * Create order and product.
 *
 * @param {{
 *  crmId: string,
 *  title: string,
 *  value: number,
 *  status: OrderStatusEnum,
 *  client: {
 *    name: string
 *  }
 * }}
 */
module.exports.createOrder = async (orderData) => {
  const product = await ProductDomain.createProduct({
    description: orderData.title
  })
  await OrderDomain.createOrder({
    ...orderData,
    product: {
      id: product._id,
      description: product.description,
      erpId: product.erpId
    }
  })
}
