//index.js
const app = getApp()

Page({
  data: {
  },

  onLoad(query) {
    console.log(query.id)
  },

  /**
   * 跳转支付页面
   */
  onPay(e) {
    console.log('e.currentTarget.dataset.id')
    wx.requestPayment({
      timeStamp: '',
      nonceStr: '',
      package: '',
      signType: 'MD5',
      paySign: '',
      success(res) { },
      fail(res) { }
    })
    // wx.redirectTo({
    //   url: '/pages/admin/servicers/newServicer',
    // })
  }
})
