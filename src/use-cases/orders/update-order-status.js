const { OrderDomain } = require('../../domain/orders')

module.exports.updateOrderStatus = async (event, context) => {
  try {
    const message = event.Records[0].Sns.Message
    const orderData = JSON.parse(message)
    await OrderDomain.updateOrderStatus(orderData.id, orderData)
    return {
      statusCode: 200
    }
  } catch (err) {
    console.error(`Error in ${context.functionName}`)
    throw err
  }
}
