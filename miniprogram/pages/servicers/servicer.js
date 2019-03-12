//servicer.js
const app = getApp()

Page({
  data: {
    servicer: {},
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

  onLoad(query) {
    wx.setNavigationBarTitle({
      title: '客服信息'
    })
    wx.cloud.callFunction({
      name: 'getServicers',
      data: {
        id: query.id
      }
    }).then(res => {
      const data = res.result.data
      this.setData({
        servicer: data || {}
      })

      console.log('servicer:', data)
    }).catch(console.error)
  },

  /**
   * 跳转支付页面
   */
  onGoToPay(e) {
    // console.log('e.currentTarget.dataset.id')
    // wx.requestPayment({
    //   timeStamp: '',
    //   nonceStr: '',
    //   package: '',
    //   signType: 'MD5',
    //   paySign: '',
    //   success(res) { },
    //   fail(res) { }
    // })
    // wx.redirectTo({
    //   url: '/pages/admin/servicers/newServicer',
    // })
  }
})
