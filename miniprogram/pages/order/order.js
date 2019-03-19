//index.js
const app = getApp()

Page({
  data: {
    exchangeType: '文字',
    proTalkPriceList: [],
    amaTalkPriceList: [],
    proWordPriceList: [],
    amaWordPriceList: [],
    priceList: []
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
  getPrice(proType) {
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
      this.setData({
        proTalkPriceList: proTalkArry,
        amaTalkPriceList: amaTalkArry,
        proWordPriceList: proWordArry,
        amaWordPriceList: amaWordArry,
        priceList: [...amaWordArry]
      })
    }).catch(console.error)
  },

  /**
   * 跳转支付页面
   */
  onPay(e) {
    
  }
})
