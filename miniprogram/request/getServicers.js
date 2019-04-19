/**
 * 获取客服信息
 */
module.exports = function(param, cb) {
  wx.cloud.callFunction({
    name: 'getServicers',
    data: param
  }).then(res => {
    cb(res.result.data || [])
  }).catch(console.error)
}