// 云函数入口文件
const cloud = require('wx-server-sdk')
// const config = require('../config/config')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const tradeNo = date() + randomStr(8)

  // 生成sign签名的参数
  const signParam = {
    appid: wxContext.APPID,
    mch_id: config.mchId,
    nonce_str: randomStr(32),
    out_trade_no: event.tradeNo,
    sign_type: 'MD5'
  }

  const xmlParam = Object.assign(signParam, {
    sign: sign(signParam)
  })

  const data = xmlData(xmlParam)
  try {
    return new Promise((resolve, reject) => request({
      url: 'https://api.mch.weixin.qq.com/pay/orderquery',
      method: 'POST',
      body: data
    }, (err, res, body) => {
      return res
      // 解析xml
      // xml2js.parseString(body,
      //   { explicitArray: false, ignoreAttrs: true },
      //   (error, result) => {
      //     const xml = result.xml || {}
      //     if (xml.result_code === 'SUCCESS') {
      //       const paySignParam = {
      //         appId: signParam.appid,
      //         nonceStr: signParam.nonce_str,
      //         package: `prepay_id=${xml.prepay_id}`,
      //         signType: 'MD5',
      //         timeStamp: Date.parse(new Date()) / 1000
      //       }

      //       const data2 = Object.assign(paySignParam, {
      //         paySign: sign(paySignParam),
      //         xmlParam: xmlParam,
      //         xml: xml,
      //         result: result
      //       })

      //       return resolve({
      //         errMsg: 'ok',
      //         data: data2
      //       })
      //     } else {
      //       return reject({
      //         errMsg: error
      //       })
      //     }
      //   })
      // })
    )
  } catch (e) {
    console.error(e)
  }


  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}