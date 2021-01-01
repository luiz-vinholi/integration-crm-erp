const { ResponseHandler } = require('./response.handler')
const querystring = require('querystring')

class OrderErpRepositoryHandler extends ResponseHandler {
  _handleQuery (apikey, xmlOrderData) {
    return querystring.stringify({
      apikey,
      xml: xmlOrderData
    })
  }

  _handleCreateOrderData ({ client, item }) {
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

  _handleCreateOrderSuccessResponse (data) {
    const product = data.retorno?.pedidos[0]?.pedido
    if (product) {
      return {
        id: product.idPedido,
        number: product.numero
      }
    }
  }
}

module.exports = { OrderErpRepositoryHandler }
