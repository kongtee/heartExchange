// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

exports.main = async (event, context) => {
  const db = cloud.database({
    env: process.env.env
  })

  try {
    return await db.collection('servicers').doc(event.id).remove()
  } catch (e) {
    console.error(e)
  }
}