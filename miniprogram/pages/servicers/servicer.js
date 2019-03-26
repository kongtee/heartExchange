//servicer.js
const app = getApp()
const payment = require('../../common/payment')

let contactInfo = ''

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
    },
    hidden: true,
    orderTalk: 'active',
    orderWord: '',
    wordPriceList: [],
    talkPriceList: [],
    wordSelected: 0,
    talkSelected: 0,
    priceInfo: {
      price: 0
    },
    proType: [ '业余', '专业' ],
    focus: false,
    userInfo: null
  },

  onLoad(query) {
    wx.setNavigationBarTitle({
      title: '客服信息'
    })

    // 获取客服信息
    wx.cloud.callFunction({
      name: 'getServicers',
      data: {
        id: query.id
      }
    }).then(res => {
      const data = res.result.data
      const proType = data.proType
      this.getPrice(proType)
      this.setData({
        servicer: data || {}
      })
    }).catch(console.error)

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }
  },

  /**
   * 获取价格表
   */
  getPrice(proType) {
    wx.cloud.callFunction({
      name: 'getPrice',
      data: { proType }
    }).then(res => {
      const data = res.result.data
      let wordArry = []
      let talkArry = []
      for (let item of data) {
        if (item.exchangeType === '文字') {
          wordArry.push(item)
        } else {
          talkArry.push(item)
        }
      }
      this.setData({
        wordPriceList: wordArry,
        talkPriceList: talkArry,
        priceInfo: talkArry[0]
      })
    }).catch(console.error)
  },

  /**
   * 展示订单弹窗
   */
  onShowOrder() {
    this.setData({
      hidden: false
    })
  },

  /**
   * 隐藏订单弹窗 
   */
  onHideOrder(e) {
    if (e.target.dataset.id === 'contact') {
      return
    }
    this.setData({
      hidden: true
    })
  },

  /**
   * 切换通话和文字到通话
   */
  onTalk() {
    this.setData({
      orderTalk: 'active',
      orderWord: '',
      priceInfo: this.data.talkPriceList[this.data.talkSelected]
    })
  },

  /**
   * 切换通话和文字到文字
   */
  onWord() {
    this.setData({
      orderTalk: '',
      orderWord: 'active',
      priceInfo: this.data.wordPriceList[this.data.wordSelected]
    })
  },

  /**
   * 选择通话价格
   */
  onTalkSelected(e) {
    const index = e.target.dataset.index
    this.setData({
      talkSelected: index,
      priceInfo: e.target.dataset.price
    })
  },

  /**
   * 选择文字价格
   */
  onWordSelected(e) {
    const index = e.target.dataset.index
    this.setData({
      wordSelected: index,
      priceInfo: e.target.dataset.price
    })
  },

  onContactInput(e) {
    contactInfo = e.detail.value
  },

  /**
   * 跳转支付页面
   */
  onOrderConfirm(e) {
    if (!this.data.userInfo) {
      wx.showToast({
        title: '请授权登录',
        icon: 'loading'
      })

      return
    }
    const priceInfo = this.data.priceInfo
    const price = priceInfo.price

    console.log('priceInfo:', priceInfo)
    if (contactInfo === '') {
      wx.showToast({
        title: '请填写联系方式',
        icon: 'loading'
      })
      this.setData({
        focus: true
      })

      return
    }

    const proType = this.data.proType[priceInfo.proType]

    const param = {
      goodsDesc: `${priceInfo.exchangeType}-${proType}`,
      goodsDetail: `${priceInfo.time / 60}小时`,
      amount: price,
      attach: contactInfo,
      productId: this.data.servicer.servicerNo,
      orderInfo: {
        serviceNickName: this.data.servicer.nickName,
        proType: priceInfo.proType,
        exchangeType: priceInfo.exchangeType,
        time: priceInfo.time,
        custNickName: this.data.userInfo.nickName,
        telphone: contactInfo
      }
    }

    // 创建订单，支付
    payment.submitOrder(param, (res) => {
      if (res.errNo !== 200) {
        wx.showToast({
          title: res.errMsg,
          icon: 'loading'
        })
      }
    })
  },
  /**
   * 获取用户信息
   */
  onGetUserInfo(e) {
    wx.getUserInfo({
      success: (res) => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo
        })
      }
    })
  }
})
