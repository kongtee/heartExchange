const app = getApp()
const share = require('../../common/share')
const admin = require('../../common/admin')
let count = -1
let timeStart = null
let timeEnd = null

Page({
  data: {
    userInfo: app.globalData.userInfo,
    qrcodeClass: 'hidden',
    openid: ''
  },
  enterAlbum: function (e) {
    let url = '../detail/detail?id=' + e.currentTarget.dataset.id + '&title=' + e.currentTarget.dataset.title;
    wx.navigateTo({
      url: url
    })
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '个人中心'
    })

    console.log(!!app.globalData.userInfo, app.globalData.userInfo)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } else {
      wx.showToast({
        title: '请授权',
        icon: 'loading'
      })
      
      wx.getUserInfo({
        success: (res) => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo
          })
        }
      })
    }
  },
  /**
   * 获取管理员权限
   */
  onAdmin() {
    count++
    if (count === 0) {
      timeStart = new Date().getTime()
    } else if (count === 5) {
      count = -1;
      timeEnd = new Date().getTime()
      let time = (timeEnd - timeStart)
      if (time < 1000) {
        admin.getAdmin()
      }
    }
  },
  /**
   * 用户授权
   */
  onGetUserInfo() {
    wx.getUserInfo({
      success: (res) => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo
        })
      }
    })
  },
  /**
   * 获取用户OpenId
   */
  onGetOpenId(e) {
    wx.cloud.callFunction({
      name: 'getUserInfo'
    }).then(res => {
      console.log(res.result.openid)
      this.setData({
        openid: res.result.openid
      })
    }).catch(console.error)
  },

  /**
   * 我的订单
   */
  onMyOrder() {
    wx.navigateTo({
      url: '/pages/order/myOrder'
    })
  },
  /**
   * 支持我们
   */
  onVipTap: function () {
    wx.navigateTo({
      url: '../vip/vip'
    })
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
  },
  onQRCodeTap: function () {
    this.setData({
      qrcodeClass: ''
    })
  },
  onMaskTap: function (event) {
    let id = event.target.id
    if (id === 'mask' || id === 'maskClose') {
      this.setData({
        qrcodeClass: 'hidden'
      })
    }
  },
  //长按二维码
  onLongPressQRCode: function () {
    wx.showActionSheet({
      itemList: ['保存图片'],
      success(res) {
        if (res.tapIndex === 0) {
          //下载要保存的图片
          wx.downloadFile({
            url: '/images/erweima.jpg',
            success(res) {
              //保存到本地相册
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success(res) {
                  wx.showToast({
                    title: '已保存到本地相册'
                  })
                },
                fail(res) {
                  wx.showToast({
                    title: res.errMsg
                  })
                }
              })
            },
            fail(res) {
              wx.showToast({
                title: res.errMsg
              })
            }
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: res.errMsg
        })
      }
    })
  },
  /**
   * 去设置页面
   */
  onSetting() {
    wx.navigateTo({
      url: '/pages/personal/settings/setting',
    })
  }
})