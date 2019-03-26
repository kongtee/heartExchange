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

  const condition = {
    outTradeNo: event.outTradeNo
  }

  try {
    db.collection('orders').where(condition).update({
      // data 字段表示需新增的 JSON 数据
      data: {
        status: event.status,
        updateTime: db.serverDate()
      }
    })
  } catch (e) {
    console.error(e)
  }

  return await cloud.callFunction({
    name: 'sendMessage',
    data: event
  })
}