// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database({
    env: 'test-521157'
  })

  try {
      return await db.collection('servicers').get()
  } catch (e) {
    console.error(e)
  }
}