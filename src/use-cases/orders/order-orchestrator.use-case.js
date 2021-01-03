const AWS = require('aws-sdk')
const { CrmDealStatusEnum } = require('../../common/enums/crm-deal-status.enum')
const { OrderStatusEnum } = require('../../common/enums/order-status.enum')
const { OrderRepository } = require('../../infrastructure/repositories/orders/order.repository')

const publishNotificationByTopic = (orderData) => {
  return new AWS.SNS()
    .publish({
      Message: JSON.stringify({ default: JSON.stringify(orderData) }),
      MessageStructure: 'json',
      TopicArn: 'arn:aws:sns:us-east-1:123456789012:create-order'
    })
    .promise()
}

/**
 * Publish notification according by order data status.
 *
 * @param {boolean} dealStatus
 * @param {{
 *   crmId: string,
 *   title: string,
 *   value: string,
 *   status: CrmDealStatusEnum,
 *   client: {
 *     name: string
 *   }
 * }} orderData - Send as payload of the notificaiton.
 */
const handlePublishNotification = async (dealStatus, orderData) => {
  const publishNotification = {
    [CrmDealStatusEnum.WON]: () => publishNotificationByTopic(orderData)
  }[dealStatus]
  if (publishNotification) await publishNotification()
}

/**
 * Handle order data.
 *
 * @returns Order data to send in notification.
 */
const handleOrderData = (deal) => {
  const orderData = {
    crmId: deal.id,
    title: deal.title,
    value: deal.value,
    status: OrderStatusEnum.OPENED,
    client: {
      name: deal.contactName
    }
  }
  return orderData
}

/**
 * Orchestrates the order, publishes events according to certain parameters.
 *
 * @param {{
 *  id: string,
 *  title: string,
 *  contactName: string,
 *  value: number,
 *  status: CrmDealStatusEnum
 * }} deal
 */
module.exports.orderOrchestrator = async (deal) => {
  const orderRepository = new OrderRepository()
  const hasOrder = await orderRepository.checkIfExistsByCrmId(deal.id)
  if (!hasOrder) {
    const orderData = handleOrderData(deal)
    await handlePublishNotification(deal.status, orderData)
  }
}
