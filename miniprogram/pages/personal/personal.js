const app = getApp()
const share = require('../../common/share')
const admin = require('../../common/admin')
let count = -1
let timeStart = null
let timeEnd = null

Page({
  data: {
    userInfo: {},
    qrcodeClass: 'hidden',
    hasAuth: app.globalData.hasAuth,
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
    if (this.data.hasAuth) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          if (!app.globalData.userInfo) {
            app.globalData.userInfo = {}
          }
          Object.assign(app.globalData.userInfo, res.userInfo)
          this.setData({
            userInfo: res.userInfo,
            hasAuth: true
          })
        },
        fail: res => {
          console.log('res.userInfo:', res)
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
  getUserInfo: function (e) {
    if (!app.globalData.userInfo) {
      app.globalData.userInfo = {}
    }
    Object.assign(app.globalData.userInfo, e.detail.userInfo)
    this.setData({
      userInfo: e.detail.userInfo,
      hasAuth: true
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
  }
})