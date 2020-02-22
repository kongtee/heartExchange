// yiqing.js
const app = getApp()
const util = require('../../common/util')

Page({
  data: {
    listData: [],
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
    servicerNoList: [
      '0001', '0002', '0004', '0007', '0009', '0010',
      '0016', '0017',
      '0036', '0040', 
      '0041', '0042', '0043', '0044', '0045', '0046'
    ]
  },
  /**
   * 获取年龄
   */
  getAge(idCard) {
    return util.getAgeFromIdCard(idCard)
  },
  /**
   * 处理身份证信息，计算年龄
   */
  transServicersData(data, proType) {
    let servicers = [...data]
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
   * 获取疫情客服
   */
  getYiqingServicers() {
    wx.cloud.callFunction({
      name: 'getServicers',
      data: {
        servicerNo: this.data.servicerNoList,
        skip: this.data.nonProSkip,
        limit: this.data.nonProLimit
      }
    }).then(res => {
      const data = res.result && res.result.data || []
      this.transServicersData(data, '0')
    }).catch(console.error)
  },
  onLoad: function (query) {
    wx.setNavigationBarTitle({
      title: '公益客服列表'
    })
    this.getYiqingServicers()
  },

  /**
   * 跳转支付页面
   */
  onDetail(e) {
    const url = `/pages/servicers/servicer?id=${e.currentTarget.dataset.id}&yiqing=1`
    wx.navigateTo({ url })
  }
})