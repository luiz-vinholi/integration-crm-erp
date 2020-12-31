class ResponseHandler {
  _handleError (error) {
    const erpError = error.response?.data?.retorno
    console.log('oiiiiiiiiiiiiii', JSON.stringify(error))
    if (erpError) throw erpError
    throw error
  }

  _handleSuccess (response) {
    const error = response.data?.retorno?.erros
    if (error) throw error
    return response.data
  }
}

module.exports = { ResponseHandler }
