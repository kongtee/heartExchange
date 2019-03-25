// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database({
    env: process.env.env
  })

  const condition = {
    outTradeNo: event.outTradeNo
  }

  try {
    return await db.collection('orders').where(condition).update({
      // data 字段表示需新增的 JSON 数据
      data: {
        status: event.status,
        updateTime: db.serverDate()
      }
    })
  } catch (e) {
    console.error(e)
  }
}