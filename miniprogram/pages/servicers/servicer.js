//servicer.js
const app = getApp()

Page({
  data: {
    servicer: {}
  },

  onLoad(query) {
    wx.cloud.callFunction({
      name: 'getServicers',
      data: {
        id: query.id
      }
    }).then(res => {
      const data = res.result.data
      this.setData({
        servicer: data || {}
      })

      console.log('servicer:', data)
    }).catch(console.error)
  },

  /**
   * 跳转支付页面
   */
  onPay(e) {
    // console.log('e.currentTarget.dataset.id')
    // wx.requestPayment({
    //   timeStamp: '',
    //   nonceStr: '',
    //   package: '',
    //   signType: 'MD5',
    //   paySign: '',
    //   success(res) { },
    //   fail(res) { }
    // })
    // wx.redirectTo({
    //   url: '/pages/admin/servicers/newServicer',
    // })
  }
})
