/**
 * 获取订单列表
 */
const Date = require('../common/date')

module.exports = function (param, cb) {
  wx.cloud.callFunction({
    name: 'getOrderList',
    data: param
  }).then(res => {
    let listData = res.result.data
    for (let data of listData) {
      data.orderTime = new Date(data.orderTime * 1000).Format('yyyy-MM-dd hh:mm:ss')
    }

    cb(listData)
  }).catch(console.error)
}