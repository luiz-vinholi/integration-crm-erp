const Parser = require('fast-xml-parser').j2xParser

module.exports.convertJsToXml = (object) => {
  const parser = new Parser()
  const xmlOrder = parser.parse(object)
  return xmlOrder
}
