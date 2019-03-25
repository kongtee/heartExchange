const app = getApp()
const userInfo = require('./userInfo')

module.exports = {
  /**
   * 创建订单
   */
  createOrder(param, cb) {
    console.log('createOrder:', param)
    if (!app.globalData.userInfo) {
      userInfo.getUserInfo((param) => {
        if (param.errNo === 200) {
          wx.cloud.callFunction({
            name: 'createOrder',
            data: param
          }).then(res => {
            const data = res.result.data
            console.log('createOrder:', res, data)
            console.log(data.newOrderParam)
            this.newOrder(data.newOrderParam)
            this.requestPayment(data);
          }).catch(console.error)
        } else {
          cb(param)
        }
      })
    } else {
      wx.cloud.callFunction({
        name: 'createOrder',
        data: param
      }).then(res => {
        const data = res.result.data
        console.log('createOrder:', res, data)
        console.log(data.newOrderParam)
        this.newOrder(data.newOrderParam)
        this.requestPayment(data);
      }).catch(console.error)
    }
  },

  /**
   * 新增订单列表
   */
  newOrder(param) {
    wx.cloud.callFunction({
      name: 'addOrder',
      data: param
    })
  },

  /**
   * 发起微信支付
   */
  requestPayment(param) {
    wx.requestPayment({
      timeStamp: param.timeStamp.toString(),
      nonceStr: param.nonceStr,
      package: param.package,
      signType: 'MD5',
      paySign: param.paySign,
      success(res) {
        this.newOrder(param.newOrderParam)
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          success: () => {

          }
        })
      },
      fail(res) {
        wx.showToast({
          title: '支付未成功',
          icon: 'loading'
        })
      }
    })
  }
}