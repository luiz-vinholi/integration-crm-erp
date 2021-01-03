class ResponseHandler {
  _handleError (error) {
    const erpError = error.response && error.response.data && error.response.data.retorno
    if (erpError) throw erpError
    throw error
  }

  _handleSuccess (response) {
    const error = response.data && response.data.retorno && response.data.retorno.erros
    if (error) throw error
    return response.data
  }
}

module.exports = { ResponseHandler }
