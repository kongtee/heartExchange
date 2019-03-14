// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request')
const xml2js = require('xml2js')
const randomStr = require('./randomStr.js')
const sign = require('./sign.js')
const xmlData = require('./xmlData.js')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database({
    env: process.env.env
  })

  // 接口参数参考：https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=9_1&index=1

  // 生成sign签名的参数
  const signParam = {
    appid: wxContext.APPID,
    body: event.goodsDesc,
    mch_id: '1528145281',
    nonce_str: randomStr(32),
    notify_url: 'https://weixin.qq.com/',
    openid: wxContext.OPENID,
    out_trade_no: randomStr(8),
    sign_type: 'MD5',
    spbill_create_ip: '127.0.0.1',
    total_fee: event.amount,
    trade_type: 'JSAPI'
  }
  // detail: event.goodsDetail,

  const xmlParam = Object.assign(signParam, {
    sign: sign(signParam)
  })

  const data = xmlData(xmlParam)

  // return {
  //   xmlParam,
  //   data
  // }

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
            timeStamp: Date.parse(new Date()) / 1000
          }

          const data2 = Object.assign(paySignParam, {
            paySign: sign(paySignParam),
            xmlParam: xmlParam,
            xml: xml,
            result: result
          })
          
          return resolve({
            errMsg: 'ok',
            data: data2
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
