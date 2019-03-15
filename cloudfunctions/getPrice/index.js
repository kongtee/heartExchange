// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database({
    env: process.env.env
  })

  const where = {
    proType: event.proType || '0'
  }

  try {
    return await db.collection('price').where(where).get()
  } catch (e) {
    console.error(e)
  }
}