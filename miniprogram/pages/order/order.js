//index.js
const app = getApp()

Page({
  data: {
    exchangeType: '文字',
    proTypeValue: ['业余', '专业'],
    proType: '0',
    priceSelected: 0,
    priceInfo: {
      price: 0
    },
    proTalkPriceList: [],
    amaTalkPriceList: [],
    proWordPriceList: [],
    amaWordPriceList: [],
    priceList: [],
    priceAllList: []
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title: '马上倾诉'
    })
    this.getPrice()
  },

  /**
   * 获取价格表
   */
  getPrice() {
    wx.cloud.callFunction({
      name: 'getPrice'
    }).then(res => {
      const data = res.result.data
      let proTalkArry = []
      let amaTalkArry = []
      let proWordArry = []
      let amaWordArry = []
      for (let item of data) {
        if (item.proType === '0') {
          if (item.exchangeType === '文字') {
            amaWordArry.push(item)
          } else {
            amaTalkArry.push(item)
          }
        } else {
          if (item.exchangeType === '文字') {
            proWordArry.push(item)
          } else {
            proTalkArry.push(item)
          }
        } 
      }

      console.log('amaWordArry:', amaWordArry)

      this.setData({
        proTalkPriceList: proTalkArry,
        amaTalkPriceList: amaTalkArry,
        proWordPriceList: proWordArry,
        amaWordPriceList: amaWordArry,
        priceList: [...amaWordArry],
        priceAllList: {
          '文字': [[...amaWordArry], [...proWordArry] ],
          '通话': [[...amaTalkArry], [...proTalkArry]]
        },
        priceInfo: amaWordArry[0]
      })
    }).catch(console.error)
  },

  /**
   * 通话类型变化
   */
  onTalkTypeChange(e) {
    const exchangeType = e.detail.value
    const priceList = [...this.data.priceAllList[exchangeType][this.data.proType]]
    this.setData({
      exchangeType,
      priceList,
      priceSelected: 0,
      priceInfo: priceList[0]
    })
  },

  /**
   * 专业类型变化
   */
  onProTypeChange(e) {
    const proType = e.detail.value
    const priceList = [...this.data.priceAllList[this.data.exchangeType][proType]]
    this.setData({
      proType,
      priceList,
      priceSelected: 0,
      priceInfo: priceList[0]
    })
  },

  /**
   * 价格选择
   */
  onWordSelected(e) {
    const index = e.target.dataset.index
    this.setData({
      priceSelected: index,
      priceInfo: e.target.dataset.price
    })
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
          title: '支付成功',
          icon: 'success',
          success: function () {

          }
        })
      },
      fail(res) {
        wx.showToast({
          title: '支付未成功',
          icon: 'loading'
        })
      }
    })
  },

  /**
   * 跳转支付页面
   */
  onOrder(e) {
    const value = e.detail.value
    if (value.weixin === '' && value.qq === '' && value.telphone === '') {
      wx.showToast({
        title: '填写联系方式',
        icon: 'loading'
      })

      return
    }

    const priceInfo = this.data.priceInfo
    const price = priceInfo.price
    const attach = {
      weixin: value.weixin,
      qq: value.qq,
      telphone: value.telphone,
      requirement: value.requirement
    }
    const param = {
      goodsDesc: `${this.data.exchangeType}-${this.data.proTypeValue[value.proType]}`,
      goodsDetail: `${priceInfo.time / 60}小时`,
      amount: price,
      attach
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
