const Yup = require('yup')
const { OrderDomain } = require('../domain/orders')
const {
  responseErrorHandler,
  responseSuccessHandler
} = require('../common/handlers/response')

const _yupIntegerValidation = function (path, message) {
  return this.matches(/^\d+$/, message || `"${path}" must be a integer`)
}

const validateQuery = async (query) => {
  let errorMessage
  Yup.addMethod(
    Yup.string,
    'integer',
    _yupIntegerValidation
  )
  const querySchema = Yup.object()
    .shape({
      page: Yup.string()
        .integer('page'),
      limit: Yup.string()
        .integer('limit')
    })
    .nullable()
  await querySchema.validate(query, { abortEarly: false })
  return errorMessage
}

const handleQuery = (query) => {
  let page = 0
  let limit = 10
  if (query) {
    page = +query.page
    limit = +query.limit
  }
  return {
    page,
    limit
  }
}

module.exports.getOrders = async (event, context) => {
  try {
    const querystring = event.queryStringParameters
    await validateQuery(querystring)
    const query = handleQuery(querystring)
    const orders = await OrderDomain.getOrders(query)
    return responseSuccessHandler(200, orders)
  } catch (error) {
    if (error.name === 'ValidationError') {
      return responseErrorHandler(400, error.errors)
    }
    console.error(`Error in ${context.functionName}`, error)
    throw error
  }
}
