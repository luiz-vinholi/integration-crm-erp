const { ProductRepository } = require('../../infrastructure/repositories/products/product.repository')
const { ProductErpRepository } = require('../../infrastructure/repositories/erp/product-erp.repository')

/**
  Create product in ERP and database if not exists in both.

  @param {{
    description: string
  }} productData
  @param {ProductRepository} _productRepository - Product repository injection
 */
module.exports.createProduct = async (
  productData,
  _productRepository = new ProductRepository(),
  _productErpRepository = new ProductErpRepository()
) => {
  let product = await _productRepository.getProductByDescription(productData.description)
  if (!product) {
    const erpProduct = await _productErpRepository.createProduct(productData)
    product = await _productRepository.createProduct({
      ...productData,
      erpId: erpProduct.code
    })
  }
  return product
}
