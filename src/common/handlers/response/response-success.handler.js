/**
 * Response success handler.
 *
 * @param {number} statusCode - Request http status code.
 * @param {any} detail - Response data.
 */
module.exports.responseSuccessHandler = (statusCode, data) => {
  return {
    statusCode,
    body: data && JSON.stringify({ data })
  }
}
