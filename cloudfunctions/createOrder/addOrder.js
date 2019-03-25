const cloud = require('wx-server-sdk')

cloud.init()

module.exports = function(param) {
  try {
    const res = await cloud.callFunction({
      name: 'addOrder',
      data: param
    })
  } catch(e) {
    console.error('云函数addOrder调用失败')
  }

  return res.result
}
