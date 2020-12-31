const querystring = require('querystring')
const { default: Axios } = require('axios')
const { convertJsToXml } = require('../../../common/utils/convert-js-to-xml')
const { ResponseHandler } = require('./handlers/response.handler')

class ProductErpRepository extends ResponseHandler {
  constructor () {
    super()
    this.apiKey = process.env.ERP_API_KEY
    this.axios = Axios.create({
      baseURL: process.env.ERP_URL
    })
  }

  /**
    Create product in ERP api.

    @param {{
      description: string
    }} productData
   */
  createProduct (productData) {
    const code = Date.now().toString()
    const product = {
      produto: {
        codigo: code,
        descricao: productData.description,
        tipo: 'S'
      }
    }
    const xmlProduct = convertJsToXml(product)
    const query = querystring.stringify({
      apikey: this.apiKey,
      xml: xmlProduct
    })
    return this.axios.post(`/produto/json?${query}`)
      .then(this._handleSuccess)
      .then(this._handleCreateProductSuccessResponse)
      .catch(this._handleError)
  }

  _handleCreateProductSuccessResponse (data) {
    const erpProduct = data?.retorno?.produtos[0][0]?.produto
    if (erpProduct) {
      return {
        id: erpProduct.id,
        code: erpProduct.codigo
      }
    }
  }
}

module.exports = { ProductErpRepository }
