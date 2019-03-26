// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: process.env.env
})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database({
    env: process.env.env
  })

  // 获取 AppSecret
  const res = await cloud.callFunction({
    name: 'createAccessToken'
  })

  try {
    return await db.collection('token').update({
      // data 字段表示需新增的 JSON 数据
      data: {
        acccess_token: res.result.access_token,
        updateTime: db.serverDate()
      }
    })
  } catch (e) {
    console.error(e)
    return e
  }
}