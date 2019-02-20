//servicerList.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    listData: []
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    this.getServicers()
  },

  /**
   * 获取客服信息列表
   */
  getServicers: function() {
    wx.cloud.callFunction({
      name: 'getServicers'
    }).then(res => {
      console.log('成功：', res.result)
      this.setData({
        listData: res.result.data || []
      })
    }).catch(console.error)
  },

  /**
   * 跳转新增客服页面
   */
  onAddServicer() {
    wx.redirectTo({
      url: '/pages/admin/servicers/newServicer',
    })
  },

  /**
   * 删除客服记录
   */
  onDelete(e) {
    var self = this
    wx.showModal({
      title: '提示',
      content: '确定要删除？',
      success(res) {
        if (res.confirm) {
          const id = e.currentTarget.dataset.id
          console.log(id)
          wx.cloud.callFunction({
            name: 'deleteServicer',
            data: { id }
          }).then(res => {
            if (res.result.errMsg === 'document.remove:ok') {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })
              self.getServicers()
            } else {
              wx.showToast({
                title: '删除失败',
                icon: 'none',
                duration: 2000
              })
            }
            console.log('成功：', res.result)
          }).catch(console.error)
        } else if (res.cancel) {
        }
      }
    })
  }
})
