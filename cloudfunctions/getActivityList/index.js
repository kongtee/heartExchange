// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database({
    env: process.env.env
  })

  const where = {
    name: event.name,
    online: event.online
  }

  try {
    return await db.collection('activityServicers').where(where).get()
  } catch (e) {
    console.error(e)
  }
}