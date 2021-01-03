const { orderOrchestrator } = require('../use-cases/orders/order-orchestrator.use-case')

module.exports.orderOrchestrator = async (event) => {
  const { current: deal } = JSON.parse(event.body)
  await orderOrchestrator({
    ...deal,
    contactName: deal.person_name
  })
  return {
    statusCode: 200
  }
}
