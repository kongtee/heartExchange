//servicerList.js
const app = getApp()

Page({
  data: {
    listData: [],
    skip: 0,
    limit: 20,
    end: false,   // 是否还有数据
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

  onLoad: function() {
    wx.setNavigationBarTitle({
      title: '后台管理 - 客服列表'
    })

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
  getServicers() {
    wx.cloud.callFunction({
      name: 'getServicers',
      data: {
        skip: this.data.skip,
        limit: this.data.limit
      }
    }).then(res => {
      console.log('成功：', res.result)
      const data = res.result.data || []
      const listData = this.data.listData.concat(data)
      if (data.length < this.data.limit) {
        this.setData({ 
          listData,
          end: true 
        })
      } else {
        this.setData({ listData })
      }
    }).catch(console.error)
  },

  /**
   * 跳转新增客服页面
   */
  onAddServicer() {
    wx.navigateTo({
      url: '/pages/admin/servicers/newServicer',
    })
  },

  /**
   * 进入编辑客服信息页
   */
  onModify(e) {
    wx.navigateTo({
      url: `/pages/admin/servicers/newServicer?id=${e.currentTarget.dataset.id}`,
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
                title: '删除成功'
              })
              self.setData({
                listData: [],
                skip: 0,
                limit: 20,
                end: false
              })
              self.getServicers()
            } else {
              wx.showToast({
                title: '删除失败',
                icon: 'none'
              })
            }
            console.log('成功：', res.result)
          }).catch(console.error)
        } else if (res.cancel) {
        }
      }
    })
  },

  /**
   * 上拉刷新
   */
  onReachBottom() {
    if (!this.data.end) {
      this.setData({
        skip: this.data.skip + this.data.limit
      })

      this.getServicers()
    }
  },

  /**
   * 获取客服确认码
   */
  getServicerCode(data, index) {
    wx.cloud.callFunction({
      name: 'common',
      data: {
        random: 10
      }
    }).then(res => {
      if (res.result) {
        const random = res.result.random
        const param = Object.assign(data, {
          id: data._id,
          servicerCode: random
        })
        console.log('更新参数:',param)

        wx.cloud.callFunction({
          name: 'updateServicer',
          data: param
        }).then(res => {
          console.log('修改成功：', res)
          this.data.listData[index].servicerCode = random
          this.setData({
            listData: this.data.listData
          })
          wx.showModal({
            title: '客服确认码',
            content: this.data.listData[index].servicerCode,
            showCancel: false
          })
        }).catch('更新客户信息', console.error)
      } else {
        console.log('获取随机数失败')
      }
    }).catch(console.error)
  },

  /**
   * 获取客服确认码
   */
  onGetServicerCode(e) {
    console.log(e._relatedInfo.anchorTargetText)
    const index = e.target.dataset.index
    const data = this.data.listData[index]

    if (e._relatedInfo.anchorTargetText === '生成确认码') {
      this.getServicerCode(data, index)
    } else {
      wx.showModal({
        title: '客服确认码',
        content: data.servicerCode,
        showCancel: false
      })
    }
  }
})
