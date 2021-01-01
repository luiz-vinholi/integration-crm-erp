const { default: Axios } = require('axios')
const { convertJsToXml } = require('../../../common/utils/convert-js-to-xml')
const { OrderErpRepositoryHandler } = require('./handlers/order-erp-repository.handler')

class OrderErpRepository extends OrderErpRepositoryHandler {
  constructor () {
    super()
    this.apiKey = process.env.ERP_API_KEY
    this.axios = Axios.create({
      baseURL: process.env.ERP_URL
    })
  }

  /**
    Create order in ERP api.

    @param {{
      client: { name: string },
      item: {
        code: string,
        description: number,
        unit_value: number,
        quantity: number
      }
    }} orderErpData
   */
  createOrder (orderData) {
    const order = this._handleCreateOrderData(orderData)
    const xmlOrder = convertJsToXml(order)
    const query = this._handleQuery(this.apiKey, xmlOrder)
    return this.axios.post(
      `/pedido/json?${query}`
    )
      .then(this._handleSuccess)
      .then(this._handleCreateOrderSuccessResponse)
      .catch(this._handleError)
  }

  /**
    Update order status in ERP api.

    @param {string} number - Number of order in ERP.
    @param {ErpOrderStatusEnum} status - Order status to update in ERP.
   */
  async updateOrderStatus (number, status) {
    const orderData = {
      pedido: {
        idSituacao: status
      }
    }
    const xmlOrderData = convertJsToXml(orderData)
    const query = this._handleQuery(this.apiKey, xmlOrderData)
    await this.axios.put(`/pedido/${number}/json?${query}`)
      .then(this._handleSuccess)
      .catch(this._handleError)
  }
}

module.exports = { OrderErpRepository }
