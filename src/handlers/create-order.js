const { createOrder } = require('../use-cases/orders/create-order.use-case')

module.exports.createOrder = async (event, context) => {
  try {
    const message = event.Records[0].Sns.Message
    const orderData = JSON.parse(message)
    await createOrder(orderData)
    return {
      statusCode: 201
    }
  } catch (error) {
    console.error(`Error in ${context.functionName}`, error)
    throw error
  }
}
