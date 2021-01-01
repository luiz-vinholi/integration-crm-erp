const { ProductModel } = require('../../models/product.model')

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
  getProductByDescription (description) {
    return this.productModel.findOne({
      $text: {
        $search: description,
        $caseSensitive: true,
        $diacriticSensitive: true
      }
    })
  }
}

module.exports = { ProductRepository }
