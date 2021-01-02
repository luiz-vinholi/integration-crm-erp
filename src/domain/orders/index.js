module.exports.OrderDomain = {
  ...require('./create-order.domain'),
  ...require('./update-order-status.domain')
}
