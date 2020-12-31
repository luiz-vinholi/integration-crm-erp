const { default: Axios } = require('axios')
const querystring = require('querystring')
const { convertJsToXml } = require('../../../common/utils/convert-js-to-xml')
const { ResponseHandler } = require('./handlers/response.handler')

class OrderErpRepository extends ResponseHandler {
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
    const order = this._handleOrderData(orderData)
    const xmlOrder = convertJsToXml(order)
    const query = querystring.stringify({
      apikey: this.apiKey,
      xml: xmlOrder
    })
    return this.axios.post(
      `/pedido/json?${query}`
    )
      .then(this._handleSuccess)
      .then(this._handleCreateProductSuccessResponse)
      .catch(this._handleError)
  }

  _handleOrderData ({ client, item }) {
    return {
      pedido: {
        cliente: {
          nome: client.name
        },
        itens: [
          {
            item: {
              codigo: item.code,
              descricao: item.description,
              vlr_unit: item.unit_value,
              qtde: item.quantity
            }
          }
        ]
      }
    }
  }

  _handleCreateProductSuccessResponse (data) {
    const product = data.retorno?.pedidos[0]?.pedido
    if (product) {
      return {
        id: product.idPedido,
        number: product.numero
      }
    }
  }
}

module.exports = { OrderErpRepository }
