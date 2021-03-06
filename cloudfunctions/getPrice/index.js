// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database({
    env: process.env.env
  })

  const where = {}

  if (event.proType !== 'undefined') {
    where.proType = event.proType
  }

  try {
    return await db.collection('price').where(where).orderBy('price', 'asc').get()
  } catch (e) {
    console.error(e)
  }
}