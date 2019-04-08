// pages/personal/settings/servicerAuth.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    servicerNoErr: true,
    servicerCodeErr: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onTest() {
    wx.cloud.callFunction({
      name: 'sendMessage'
    }).then(res => {
      const result = res.result
      console.log('test:', res)
    }).catch(console.error)
  },

  onAuth(e) {
    console.log(e)
    // if (e.detail.value.servicerNo === '') {
    //   this.setData({
    //     servicerNoErr: false
    //   })

    //   return
    // }

    // if (e.detail.value.servicerCode === '') {
    //   this.setData({
    //     servicerCodeErr: false
    //   })

    //   return
    // }

    // wx.cloud.callFunction({
    //   name: 'servicerAuth',

    // })
  }
})