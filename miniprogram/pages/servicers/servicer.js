//servicer.js
const app = getApp()

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
    wordSelected: -1,
    talkSelected: -1,
    priceInfo: {
      price: 0
    },
    proType: [ '业余', '专业' ],
    focus: false
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
      const proType = data.proType
      this.getPrice(proType)
      this.setData({
        servicer: data || {}
      })
    }).catch(console.error)
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
        talkPriceList: talkArry
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
      priceInfo: {
        price: 0
      }
    })
  },

  /**
   * 切换通话和文字到文字
   */
  onWord() {
    this.setData({
      orderTalk: '',
      orderWord: 'active',
      priceInfo: {
        price: 0
      }
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
   * 发起微信支付
   */
  requestPayment(param) {
    wx.requestPayment({
      timeStamp: param.timeStamp.toString(),
      nonceStr: param.nonceStr,
      package: param.package,
      signType: 'MD5',
      paySign: param.paySign,
      success(res) {
        wx.showToast({
          title: '支持成功',
          icon: 'success',
          success: function () {
            
          }
        })
      },
      fail(res) {
        wx.showToast({
          title: '支持未成功',
          icon: 'loading'
        })
      }
    })
  },

  /**
   * 跳转支付页面
   */
  onOrderConfirm(e) {
    const priceInfo = this.data.priceInfo
    const price = priceInfo.price
    if (price === 0) {
      wx.showToast({
        title: '请选择价格',
        icon: 'loading'
      })
      return
    } 
    console.log(this.data.contact)
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

    const param = {
      goodsDesc: `${priceInfo.exchangeType}-${this.data.proType[priceInfo.proType]}`,
      goodsDetail: `${priceInfo.time / 60}小时`,
      amount: price,
      attach: contactInfo,
      productId: this.data.servicer.servicerNo
    }
    wx.cloud.callFunction({
      name: 'createOrder',
      data: param
    }).then(res => {
      const data = res.result.data
      console.log('createOrder:', res, data)
      this.requestPayment(data);
    }).catch(console.error)
  }
})
