const { OrderDomain } = require('../../domain/orders')
const { ProductDomain } = require('../../domain/products')

module.exports.createOrder = async (event, context) => {
  try {
    const message = event.Records[0].Sns.Message
    const orderData = JSON.parse(message)
    const product = await ProductDomain.createProduct({
      description: orderData.title
    })
    await OrderDomain.createOrder({
      ...orderData,
      product: {
        id: product.id,
        description: product.description,
        erpId: product.erpId
      }
    })

    return {
      statusCode: 201
    }
  } catch (error) {
    console.error(`Error in ${context.functionName}`, error)
    throw error
  }
}
