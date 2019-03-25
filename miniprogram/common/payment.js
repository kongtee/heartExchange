/**
 * 提交订单，记录订单，支付封装
 * 
 * const payment = require('../../common/payment')
 * const param = {
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

 * payment.submitOrder(param, (res) => {})
 */
const app = getApp()
const userInfo = require('./userInfo')

module.exports = {
  /**
   * 提交订单
   */
  submitOrder(param, cb) {
    console.log('createOrder:', param)
    if (!app.globalData.userInfo) {
      userInfo.getUserInfo((res) => {
        if (res.errNo === 200) {
          this.createOrder(param)
        } else {
          cb(res)
        }
      })
    } else {
      this.createOrder(param)
    }
  },
  /**
   * 创建订单
   */
  createOrder(param) {
    wx.cloud.callFunction({
      name: 'createOrder',
      data: param
    }).then(res => {
      const data = res.result.data
      console.log('createOrder:', data.newOrderParam)
      data.newOrderParam.status = '待支付' 
      this.newOrder(data.newOrderParam)
      this.requestPayment(data);
    }).catch(console.error)
  },

  /**
   * 发起微信支付
   */
  requestPayment(param) {
    const self = this
    wx.requestPayment({
      timeStamp: param.timeStamp.toString(),
      nonceStr: param.nonceStr,
      package: param.package,
      signType: 'MD5',
      paySign: param.paySign,
      success(res) {
        const updateOrderParam = {
          outTradeNo: param.newOrderParam.outTradeNo,
          status: '已支付'
        }
        console.log('updateOrderParam:', updateOrderParam)
        self.updateOrder(updateOrderParam)
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          success: () => {

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
   * 新增订单列表
   */
  newOrder(param) {
    wx.cloud.callFunction({
      name: 'addOrder',
      data: param
    }).then(res => {
      console.log('newOrder:', res.result)
    }).catch(console.error)
  },

  /**
   * 更新订单状态
   */
  updateOrder(param) {
    console.log('updateOrder', param)
    wx.cloud.callFunction({
      name: 'updateOrder',
      data: param
    }).then(res => {
      console.log('updateOrder:', res.result)
    }).catch(console.error)
  }
} 