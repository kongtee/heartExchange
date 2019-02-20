// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database({
    env: process.env.env
  })

  const skip = event.skip || 0
  const limit = event.limit || 20

  try {
    return await db.collection('servicers').skip(skip).limit(limit).get()
  } catch (e) {
    console.error(e)
  }
}