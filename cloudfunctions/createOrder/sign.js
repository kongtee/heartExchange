/**
 * 生成签名
 */
const MD5 = require('blueimp-md5')

module.exports = function(param) {
  let stringA = ''
  for(let key in param) {
    stringA += `${key}=${param[key]}&`  
  }

  const stringSignTemp = stringA + "key=ngx6hnnnia2247n94nilwl6ln4342aht"

  const sign = MD5(stringSignTemp).toUpperCase()

  return sign
}
