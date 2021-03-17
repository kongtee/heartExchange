// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request')
const xml2js = require('xml2js')
const date = require('./date')
const randomStr = require('./randomStr')
const sign = require('./sign')
const xmlData = require('./xmlData')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // 接口参数参考：https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=9_1&index=1

  const tradeNo = date() + randomStr(8)

  // 生成sign签名的参数
  const signParam = {
    appid: wxContext.APPID,
    attach: event.attach,
    body: event.goodsDesc,
    mch_id: '1528145281',
    nonce_str: randomStr(32),
    notify_url: 'https://weixin.qq.com/',
    openid: wxContext.OPENID,
    out_trade_no: tradeNo,
    product_id: event.productId,
    sign_type: 'MD5',
    spbill_create_ip: '127.0.0.1',
    total_fee: event.amount,
    trade_type: 'JSAPI'
  }

  // 订单参数
  const orderInfo = event.orderInfo
  const newOrderParam = {
    outTradeNo: signParam.out_trade_no,
    avatarId: orderInfo.avatarId,
    servicerNo: signParam.product_id,
    serviceNickName: orderInfo.serviceNickName,
    proType: orderInfo.proType,
    exchangeType: orderInfo.exchangeType,
    time: orderInfo.time,
    price: signParam.total_fee,
    // orderTime: paySignParam.timeStamp,
    orderTime: Date.parse(new Date()) / 1000,
    custOpenid: wxContext.OPENID,
    custNickName: orderInfo.custNickName,
    telphone: orderInfo.telphone,
    memo: orderInfo.memo,
  }

  if (event.amount == 0) {
    return {
      errMsg: 'ok',
      data: { newOrderParam }
    }
  }

  const xmlParam = Object.assign(signParam, {
    sign: sign(signParam)
  })

  const data = xmlData(xmlParam)

  return new Promise((resolve, reject) => request({
    url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
    method: 'POST',
    body: data
    }, (err, res, body) => {
      // 解析xml
      xml2js.parseString(body, 
      { explicitArray: false, ignoreAttrs: true }, 
      (error, result) => {
        const xml = result.xml || {}
        if (xml.result_code === 'SUCCESS') {

          const paySignParam = {
            appId: signParam.appid,
            nonceStr: signParam.nonce_str,
            package: `prepay_id=${xml.prepay_id}`,
            signType: 'MD5',
            // timeStamp: Date.parse(new Date()) / 1000
            timeStamp: newOrderParam.orderTime
          }

          const resData = Object.assign(paySignParam, {
            paySign: sign(paySignParam),
            newOrderParam
            // xmlParam: xmlParam,
            // xml: xml,
            // result: result
          })

          return resolve({
            errMsg: 'ok',
            data: resData
          })
        } else {
          return reject({
            errMsg: error
          })
        }
      })
    })
  )
}
