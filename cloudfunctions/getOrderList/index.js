// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database({
    env: process.env.env
  })

  const skip = event.skip || 0
  const limit = event.limit || 20
  const cust = event.cust
  let where = {}
  if (cust) {
    where = {
      custOpenid: wxContext.OPENID
    }
  }

  try {
    return await db.collection('orders').where(where).orderBy('updateTime', 'desc').skip(skip).limit(limit).get()
  } catch (e) {
    console.error(e)
  }
}