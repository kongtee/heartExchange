//index.js
const app = getApp()
const share = require('../../common/share')
const util = require('../../common/util')

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    listData: [],
    banner: {
      url: '/images/banner.jpg'
    },
    proList: [],
    nonProList: [],
    maritalStatus: ['未婚', '已婚无孩', '已婚有孩'],
    goodColor: {
      '婚姻家庭': '#FFC125',
      '恋爱情感': '#FF69B4',
      '亲子关系': '#F56C6C',
      '职场减压': '#67C23A',
      '学业问题': '#FF0000',
      '人际关系': '#CDCD00',
      '情绪疏导': '#409EFF'
    },
    goodBgColor: {
      '婚姻家庭': 'rgba(255, 193, 37, .2)',
      '恋爱情感': 'rgba(255, 105, 180, .2)',
      '亲子关系': 'rgba(245, 108, 108, .2)',
      '职场减压': 'rgba(103,194, 58, .2)',
      '学业问题': 'rgba(255, 0, 0, .2)',
      '人际关系': 'rgba(205, 205, 0, .2)',
      '情绪疏导': 'rgba(64, 158, 255, .2)'
    }
  },

  onLoad: function(query) {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
 
    try {
      // 获取管理员信息
      const admin = wx.getStorageSync('admin')
      if (admin) {
        // 存在管理员信息先清除掉
        wx.removeStorage({
          key: 'admin'
        })
      } else {
        // 获取管理员信息
        wx.cloud.callFunction({
          name: 'login'
        }).then(res => {
          if (res.result.data.length > 0) {
            wx.redirectTo({
              url: '/pages/admin/users/admin',
            })
          }
        }).catch(console.error)
      }
    } catch (e) {
      console.err('获取本地admin参数失败')
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
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

  transServicersData(data) {
    let servicers = [ ...data ]
    for (let servicer of servicers) {
      servicer.age = this.getAge(servicer.idcard)
    }
    this.setData({
      proList: servicers || []
    })
  },

  /**
   * 获取专业客服列表
   */
  getProServicers() {
    wx.cloud.callFunction({
      name: 'getServicers',
      data: {
        proType: '1'
      }
    }).then(res => {
      const data = res.result.data
      this.transServicersData(data)
    }).catch(console.error)
  },
  
  /**
   * 获取业余客服列表
   */
  getNonProServicers() {
    wx.cloud.callFunction({
      name: 'getServicers',
      data: {
        proType: '0'
      }
    }).then(res => {
      const data = res.result.data
      this.setData({
        nonProList: data || []
      })
    }).catch(console.error)
  },

  /**
   * 获取客服信息列表
   */
  getServicers: function() {
    this.getProServicers()
    this.getNonProServicers()
  },

  /**
   * 跳转支付页面
   */
  onDetail(e) {
    const url = `/pages/servicers/servicer?id=${e.currentTarget.dataset.id}`
    wx.navigateTo({ url })
  },

  onShareAppMessage: function (res) {
    return share
  },

  getAge(idCard) {
    return util.getAgeFromIdCard(idCard)
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
