const AWS = require('aws-sdk')
const { CrmDealStatusEnum } = require('../../common/enums/crm-deal-status.enum')

const publishCreateOrderNotification = (order, context) => {
  return new AWS.SNS({
    endpoint: 'https://cccfb1c9ab19.ngrok.io'
  })
    .publish({
      Message: JSON.stringify({ default: JSON.stringify(order) }),
      MessageStructure: 'json',
      TopicArn: 'create-order'
    })
    .promise()
}

// RENOMEAR
module.exports.checkOrder = async (event, context) => {
  const { current: deal } = JSON.parse(event.body)
  const publishNotification = {
    [CrmDealStatusEnum.WON]: publishCreateOrderNotification
  }[deal.status]
  const orderData = {
    crmId: deal.id,
    title: deal.title,
    client: {
      name: deal.person_name
    },
    value: deal.value
  }
  if (publishNotification) {
    await publishNotification(orderData, context)
  }
  return {
    statusCode: 200
  }
}
