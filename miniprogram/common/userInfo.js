const app = getApp()

module.exports = {
  getUserInfo(cb) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo
              cb({
                errNo: 200,
                errMsg: 'success'
              })
            },
            fail: res => {
              cb({
                errNo: 201,
                errMsg: '获取用户信息失败'
              })
            }
          })
        } else {
          // 未授权弹窗授权
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              wx.getUserInfo({
                success: res => {
                  this.globalData.userInfo = res.userInfo
                  cb({
                    errNo: 200,
                    errMsg: 'success'
                  })
                },
                fail: res => {
                  cb({
                    errNo: 201,
                    errMsg: '获取用户信息失败'
                  })
                }
              })
            },
            fail() {
              cb({
                errNo: 202,
                errMsg: '未授权'
              })
            }
          })
        }
      }
    })
  }
}