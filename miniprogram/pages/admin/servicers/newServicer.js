//servicers/newServicer.js
const app = getApp()

Page({
  data: {
    userInfo: {
      maritalIndex: 0,  // 婚姻状况
    },
    btnText: '新增',
    id: null,
    maritalStatus: [ '未婚', '已婚无孩', '已婚有孩' ],
    goodFields: ['婚姻家庭', '恋爱情感', '亲子关系', '职场减压', '学业问题', '人际关系', '情绪疏导']  // 擅长领域
  },

  onLoad: function(query) {
    wx.setNavigationBarTitle({
      title: '后台管理 - 新增客服'
    })

    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    const id = query.id
    if (id) {
      // 修改信息
      wx.setNavigationBarTitle({
        title: '后台管理 - 修改客服信息'
      })
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
      // 新增信息
      this.data.btnText !== '新增' && this.setData({
        btnText: '新增'
      })

      // 获取擅长领域数据
      wx.cloud.callFunction({
        name: 'getGoodFields'
      }).then(res => {
        if (res.result) {
          console.log('获取擅长领域成功：', res)
          this.setData({
            goodFields: res.result.data || []
          })
        } else {
          wx.showToast({
            title: '获取擅长领域失败',
            icon: 'none'
          })
        }
      }).catch(console.error)
    }
  },

  /**
   * 上传头像
   */
  onUpload() {
    const self = this
    wx.chooseImage({
      success: chooseResult => {
        console.log(chooseResult)
        const url = chooseResult.tempFilePaths[0]
        const imageName = `servicers/${new Date().getTime() + Math.random(100)}.png`
        //将图片上传至云存储空间
        wx.cloud.uploadFile({
          // 指定上传到的云路径
          cloudPath: imageName,
          // 指定要上传的文件的小程序临时文件路径
          filePath: url,
          // 成功回调
          success: res => {
            console.log('上传成功', res)
            self.setData({
              'userInfo.avatarUrl': url,
              'userInfo.avatarId': res.fileID
            })
          },
        })
      },
    })
  },

  /**
   * 婚姻状态变化
   */
  onMaritalChange(e) {
    this.setData({
      'userInfo.maritalIndex': e.detail.value
    })
  },

  onGoodChange(e) {

  },

  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value, this.data.id)

    if (!this.data.id) {
      wx.cloud.callFunction({
        name: 'addServicer',
        data: e.detail.value
      }).then(res => {
        console.log('新增')
        if (res.result) {
          wx.redirectTo({
            url: '/pages/admin/servicers/servicerList',
          })
          console.log('添加成功：', res)
        } else {
          wx.showToast({
            title: '添加失败',
            icon: 'none'
          })
        }
      }).catch(console.error)
    } else {
      console.log('修改')
      const data = e.detail.value
      data.id = this.data.id
      wx.cloud.callFunction({
        name: 'updateServicer',
        data: e.detail.value
      }).then(res => {
        console.log('修改：', res)
        if (res.result) {
          wx.showToast({
            title: '修改成功'
          })
        } else {
          wx.showToast({
            title: '修改失败',
            icon: 'none'
          })
        }
      }).catch(console.error)
    }
  }
})
