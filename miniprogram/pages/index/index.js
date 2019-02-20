//index.js
const app = getApp()
const share = require('../../common/share')

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    listData: [],

    banner: {},
    newList: [],
    recommendList: []
  },

  onLoad: function(query) {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    const src = query.src

    // wx.cloud.callFunction({
    //   name: 'login'
    // }).then(res => {
    //   console.log('成功：', res.result)
    //   if (!src && res.result.errMsg === "collection.get:ok") {
    //     wx.redirectTo({
    //       url: '/pages/admin/users/admin',
    //     })
    //   }
    // }).catch(console.error)


    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // console.log('wx.getUserInfo:', res);
              // if (!src && res.userInfo.nickName === '天外有天') {
              //   wx.redirectTo({
              //     url: '/pages/admin/users/admin',
              //   })
              // }
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            },
            fail: res => {

            }
          })
        }
      }
    })

    this.getServicers()
  },

  /**
   * 获取客服信息列表
   */
  getServicers: function() {
    wx.cloud.callFunction({
      name: 'getServicers'
    }).then(res => {
      const data = res.result.data
      const newList = data.slice(0, 3)
      const recommendlist = data.slice(3, 5)
      this.setData({
        banner: data[0],
        newList: newList || [],
        recommendList: recommendlist || [],
        listData: recommendlist || []
      })
    }).catch(console.error)
  },

  /**
   * 跳转支付页面
   */
  onOrder(e) {
    const url = `/pages/order/order?id=${e.currentTarget.dataset.id}`
    console.log(url)
    wx.navigateTo({ url })
  },

  onShareAppMessage: function (res) {
    return share
  }

  // onGetUserInfo: function(e) {
  //   if (!this.logged && e.detail.userInfo) {
  //     this.setData({
  //       logged: true,
  //       avatarUrl: e.detail.userInfo.avatarUrl,
  //       userInfo: e.detail.userInfo
  //     })
  //   }
  // },

  // onGetOpenid: function() {
  //   // 调用云函数
  //   wx.cloud.callFunction({
  //     name: 'login',
  //     data: {},
  //     success: res => {
  //       console.log('[云函数] [login] user openid: ', res.result.openid)
  //       app.globalData.openid = res.result.openid
  //       wx.navigateTo({
  //         url: '../userConsole/userConsole',
  //       })
  //     },
  //     fail: err => {
  //       console.error('[云函数] [login] 调用失败', err)
  //       wx.navigateTo({
  //         url: '../deployFunctions/deployFunctions',
  //       })
  //     }
  //   })
  // },

  // 上传图片
  // doUpload: function () {
  //   // 选择图片
  //   wx.chooseImage({
  //     count: 1,
  //     sizeType: ['compressed'],
  //     sourceType: ['album', 'camera'],
  //     success: function (res) {

  //       wx.showLoading({
  //         title: '上传中',
  //       })

  //       const filePath = res.tempFilePaths[0]
        
  //       // 上传图片
  //       const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
  //       wx.cloud.uploadFile({
  //         cloudPath,
  //         filePath,
  //         success: res => {
  //           console.log('[上传文件] 成功：', res)

  //           app.globalData.fileID = res.fileID
  //           app.globalData.cloudPath = cloudPath
  //           app.globalData.imagePath = filePath
            
  //           wx.navigateTo({
  //             url: '../storageConsole/storageConsole'
  //           })
  //         },
  //         fail: e => {
  //           console.error('[上传文件] 失败：', e)
  //           wx.showToast({
  //             icon: 'none',
  //             title: '上传失败',
  //           })
  //         },
  //         complete: () => {
  //           wx.hideLoading()
  //         }
  //       })

  //     },
  //     fail: e => {
  //       console.error(e)
  //     }
  //   })
  // },
})
