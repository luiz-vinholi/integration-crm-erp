const AWS = require('aws-sdk')
const { CrmDealStatusEnum } = require('../../common/enums/crm-deal-status.enum')
const { OrderStatusEnum } = require('../../common/enums/order-status.enum')
const { OrderRepository } = require('../../infrastructure/repositories/orders/order.repository')

const publishNotificationByTopic = (topic, orderData) => {
  return new AWS.SNS()
    .publish({
      Message: JSON.stringify({ default: JSON.stringify(orderData) }),
      MessageStructure: 'json',
      TopicArn: topic
    })
    .promise()
}

const getTopicNotification = (hasOrder) => {
  return hasOrder ? 'update-order' : 'create-order'
}

/**
 * Publish notification according by order data status.
 *
 * @param {boolean} hasOrder - Has order in database.
 * @param {{
 *   crmId: string,
 *   title: string,
 *   value: string,
 *   status: CrmDealStatusEnum,
 *   client: {
 *     name: string
 *   }
 * }} orderData - Send as payload of the notificaiton
 */
const handlePublishNotification = async (hasOrder, dealStatus, orderData) => {
  const topic = getTopicNotification(hasOrder)
  const publishNotification = {
    [CrmDealStatusEnum.WON]: () => publishNotificationByTopic(topic, orderData),
    [CrmDealStatusEnum.OPEN]: () => hasOrder && publishNotificationByTopic(topic, orderData),
    [CrmDealStatusEnum.LOST]: () => hasOrder && publishNotificationByTopic(topic, orderData)
  }[dealStatus]
  if (publishNotification) await publishNotification()
}

/**
 * Handle order data.
 *
 * @returns Order data to send in notification.
 */
const handleOrderData = (deal) => {
  const status = {
    [CrmDealStatusEnum.WON]: OrderStatusEnum.FINISHED,
    [CrmDealStatusEnum.OPEN]: OrderStatusEnum.OPENED,
    [CrmDealStatusEnum.LOST]: OrderStatusEnum.CANCELED
  }
  const orderData = {
    crmId: deal.id,
    title: deal.title,
    value: deal.value,
    status,
    client: {
      name: deal.person_name
    }
  }
  return orderData
}

module.exports.checkOrder = async (event) => {
  const { current: deal } = JSON.parse(event.body)
  const orderRepository = new OrderRepository()
  const hasOrder = await orderRepository.checkIfExistsByCrmId(deal.id)
  const orderData = handleOrderData(deal)
  await handlePublishNotification(hasOrder, orderData)
  return {
    statusCode: 200
  }
}
