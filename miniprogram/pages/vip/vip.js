//vip.js
//获取应用实例
const app = getApp()
const share = require('../../common/share')

Page({
  data: {
    vip: {
      vip30: '../../images/vip30.png',
      vip90: '../../images/vip90.png'
    },
    support: false
  },

  onLoad: function (option) {
    this.setData({
      support: app.globalData.userInfo.PayControl
    })
    wx.setNavigationBarTitle({
      title: '支持我们'
    })
  },

  //发起微信支付
  requestPayment: function(data) {
    wx.requestPayment({
      timeStamp: data.CurTime + '',
      nonceStr: data.NonceStr,
      package: 'prepay_id=' + data.PrepayID,
      signType: 'MD5',
      paySign: data.Sign,
      success: function (res) {
        app.globalData.userInfo.bVip = true
        wx.showToast({
          title: '支持成功',
          icon: 'success',
          duration: 2000,
          success: function() {
            wx.switchTab({
              url: '../index/index'
            })
          }
        })

      },
      fail: function (res) {
        wx.showToast({
          title: '支持未成功',
          icon: 'loading',
          duration: 2000
        })
      }
    })
  },

  onBuyVip: function(e) {
    let data = {
      GoodsDesc: "会员-支付",
      GoodsDetail: e.currentTarget.dataset.detail,
      FeeAmount: e.currentTarget.dataset.price,
      OpenID: app.globalData.userInfo.WxOpenID
    }
    
    // wx.request({
    //   url: pay.createtransaction,
    //   header: {
    //     Userkey: app.globalData.userInfo.UserKey
    //   },
    //   data: data,
    //   method: 'POST',
    //   success: (res) => {
    //     console.log(res.data)
    //     let resData = res.data || {}
    //     if (resData.RspHeader && resData.RspHeader.ErrNo == 200) {
    //       let rspJson = resData.RspJson || []
    //       this.requestPayment(rspJson);
    //     } else {
    //       wx.showToast({
    //         title: resData.RspHeader.ErrMsg,
    //         icon: 'loading',
    //         duration: 2000
    //       })
    //     }
    //   }
    // })
  },

  /**
   * 分享消息
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log('onShareAppMessage:', res.target)
    }
    return share
  }
})