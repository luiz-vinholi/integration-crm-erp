/**
 * Response error handler.
 *
 * @param {number} statusCode - Request http status code.
 * @param {any} detail - Error detail.
 */
module.exports.responseErrorHandler = (statusCode, detail) => {
  return {
    statusCode,
    body: detail && JSON.stringify({ detail })
  }
}
