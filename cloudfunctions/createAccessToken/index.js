// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request')

cloud.init({
  env: process.env.env
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // 获取 AppSecret
  const resConfig = await cloud.callFunction({
    name: 'common',
    data: {
      config: true
    }
  })

  const config = resConfig.result.config

  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${wxContext.APPID}&secret=${config.secret}`

  // 获取 access_token
  try {
    return new Promise((resolve, reject) => request({
      url,
      method: 'GET'
    }, (err, res, body) => {
      return resolve(res.body)
    }))

  } catch (e) {
    return e
  }
}