//index.js
const app = getApp()
const share = require('../../common/share')
const util = require('../../common/util')
const userInfo = require('../../common/userInfo')

Page({
  data: {
    logged: false,
    takeSession: false,
    requestResult: '',
    listData: [],
    banner: {
      url: '/images/banner.jpg'
    },
    proList: [],
    nonProList: [],
    nonProSkip: 0,
    nonProLimit: 20,
    nonProEnd: false,   // 是否还有数据
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
    },
    activityHidden: true
  },

  onLoad: function(query) {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
       

    // wx.cloud.callFunction({
    //   name: 'common',
    //   data: {
    //     random: {
    //       param: 5
    //     }
    //   }
    // }).then(res => {
    //   const result = res.result
    //   console.log('test:', res)
    // }).catch(console.error)

    // 获取用户信息
    userInfo.getUserInfo((param => {
    }))

    this.getActivityDlg()

    this.getServicers()
  },
  /**
   * 跳转到活动页
   */
  onActivity() {
    const url = `/pages/activity/yiqing`
    wx.navigateTo({ url })
    this.setData({
      activityHidden: true
    })
  },
  /**
   * 活动弹窗关闭
   */
  onActivityClose() {
    this.setData({
      activityHidden: true
    })
  },
  /**
   * 显示活动弹窗
   */
  showActivityDlg() {
    this.setData({
      activityHidden: false
    })
  },
  /**
   * 获取活动弹窗
   */
  getActivityDlg() {
    if (this.data.activityHidden) {
      this.showActivityDlg()
    }
  },
  /**
   * 处理身份证信息，计算年龄
   */
  transServicersData(data, proType) {
    let servicers = [ ...data ]
    for (let servicer of servicers) {
      servicer.age = this.getAge(servicer.idcard)
    }

    if (proType === '0') {
      const nonProListData = this.data.nonProList.concat(data) || []
      if (data.length < this.data.nonProLimit) {
        this.setData({
          nonProList: nonProListData,
          nonProEnd: true
        })
      } else {
        this.setData({ 
          nonProList: nonProListData 
        })
      }
    } else {
      this.setData({
        proList: servicers || []
      })
    }
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
      const data = res.result && res.result.data || []
      this.transServicersData(data, '1')
    }).catch(console.error)
  },
  
  /**
   * 获取业余客服列表
   */
  getNonProServicers() {
    wx.cloud.callFunction({
      name: 'getServicers',
      data: {
        proType: '0',
        skip: this.data.nonProSkip,
        limit: this.data.nonProLimit
      }
    }).then(res => {
      const data = res.result && res.result.data || []
      this.transServicersData(data, '0')
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

  /**
   * 获取年龄
   */
  getAge(idCard) {
    return util.getAgeFromIdCard(idCard)
  },

  /**
   * 跳转到随机订单页
   */
  onOrder() {
    const url = '/pages/order/order'
    wx.navigateTo({ url })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.nonProEnd) {
      this.setData({
        nonProSkip: this.data.nonProSkip + this.data.nonProLimit
      })

      this.getNonProServicers()
    }
  },
})
