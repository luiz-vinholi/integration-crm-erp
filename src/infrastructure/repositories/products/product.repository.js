/* eslint-disable no-useless-escape */
const { ProductModel } = require('../../models')

class ProductRepository {
  constructor () {
    this.productModel = ProductModel
  }

  /**
   * Create product in database.
   *
   * @param {{
   *   description: string,
   *   erpId: string
   * }} productData
   */
  createProduct (productData) {
    return this.productModel.create(productData)
  }

  /**
   * Get one product by description, applying case sensitive
   * and diacritic sensitive filters.
   *
   * @param {string} description - Product description.
   */
  async getProductByDescription (description) {
    const product = await this.productModel.findOne({
      $text: {
        $search: `\"${description}\"`
      }
    }).lean()
    return product
  }
}

module.exports = { ProductRepository }
