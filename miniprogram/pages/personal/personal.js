const app = getApp()
const share = require('../../common/share')

Page({
  data: {
    userInfo: {},
    qrcodeClass: 'hidden',
    hasAuth: app.globalData.hasAuth
  },
  enterAlbum: function (e) {
    let url = '../detail/detail?id=' + e.currentTarget.dataset.id + '&title=' + e.currentTarget.dataset.title;
    wx.navigateTo({
      url: url
    })
  },
  onLoad: function () {
    // wx.request({
    //   url: recommend.queryrecommendlist,
    //   data: {
    //     QueryStartPos: 0,
    //     QueryNumber: 10
    //   },
    //   method: 'POST',
    //   success: (res) => {
    //     let resData = res.data || {};
    //     if (resData.RspHeader && resData.RspHeader.ErrNo == 200) {
    //       let rspJson = resData.RspJson || [];
    //       this.setData({
    //         BannerList: rspJson.BannerList,
    //         RecommendImageList: rspJson.RecommendImageList
    //       });
    //     }
    //   }
    // })
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
            url: 'https://girlstyle.oss-cn-shanghai.aliyuncs.com/static/erweima.png',
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