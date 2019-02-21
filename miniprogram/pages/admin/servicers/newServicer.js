//servicers/newServicer.js
const app = getApp()

Page({
  data: {
    userInfo: {},
    btnText: '新增',
    id: null
  },

  onLoad: function(query) {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    const id = query.id
    if (id) {
      this.data.btnText !== '提交' && this.setData({
        id,
        btnText: '提交'
      })
      // 修改信息
      wx.cloud.callFunction({
        name: 'getServicers',
        data: {id}
      }).then(res => {
        console.log('成功：', res.result)
        this.setData({
          userInfo: res.result.data
        })
      }).catch(console.error)
    } else {
      this.data.btnText !== '新增' && this.setData({
        btnText: '新增'
      })
    }
  },

  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value, this.data.id)
    if (!this.data.id) {
      wx.cloud.callFunction({
        name: 'addServicer',
        data: e.detail.value
      }).then(res => {
        if (res.result) {
          wx.redirectTo({
            url: '/pages/admin/servicers/servicerList',
          })
          console.log('成功：', res)
        } else {
          wx.showToast({
            title: '添加失败',
            icon: 'none'
          })
        }
      }).catch(console.error)
    } else {
      const data = e.detail.value
      data.id = this.data.id
      wx.cloud.callFunction({
        name: 'updateServicer',
        data: e.detail.value
      }).then(res => {
        if (res.result) {
          wx.showToast({
            title: '修改成功'
          })
          console.log('成功：', res)
        } else {
          wx.showToast({
            title: '添加失败',
            icon: 'none'
          })
        }
      }).catch(console.error)
    }
  }
})
