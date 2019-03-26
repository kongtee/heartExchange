// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request')

cloud.init({
  env: process.env.env
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const proType = ['业余', '专业']
  let resToken = null
  // 获取token
  try {
    resToken = await cloud.callFunction({
      name: 'getAccessToken'
    })
  } catch(e) {
    console.log(e)
    return {
      errMsg: '获取access_token失败',
      errData: e
    }
  } 
  
  // 获取接收消息的openId和消息模板id
  let resConfig = null
  try {
    resConfig = await cloud.callFunction({
      name: 'config'
    })
  } catch (e) {
    console.log(e)
    return {
      errMsg: '获取配置信息失败',
      errData: e
    }
  }

  const data = resToken.result.data[0]

  if (!data) {
    return {
      errMsg: '获取token失败！'
    }
  }

  const messageParam = {
    touser: resConfig.touser,
    template_id: resConfig.template_id,
    page: 'pages/admin/orders/orderList',
    form_id: event.form_id,
    data: {
      keyword1: {
        value: event.outTradeNo
      },
      keyword2: {
        value: `${proType[event.proType]}-${event.exchangeType}(${event.time / 60}小时`
      },
      keyword3: {
        value: event.orderTime
      },
      keyword4: {
        value: event.price
      },
      keyword5: {
        value: event.custNickName
      },
      keyword6: {
        value: event.telphone
      }
    }
  }

  // 参考地址：https://developers.weixin.qq.com/miniprogram/dev/api-backend/sendTemplateMessage.html
  const url = `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=${data.acccess_token}`
    
  return new Promise((resolve, reject) => request({
    url,
    method: 'POST',
    body: data
  }, (err, res, body) => {
    return resolve({
      errMsg: 'ok',
      data: res
    })
  }))
}