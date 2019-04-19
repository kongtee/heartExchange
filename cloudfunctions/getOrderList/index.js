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
  const servicerNo = event.servicerNo
  let where = {}
  // 是否是请求当前用户
  if (cust) {
    where = {
      custOpenid: wxContext.OPENID
    }
  } else if (servicerNo) {
    where = {
      servicerNo
    }
  }

  try {
    return await db.collection('orders').where(where).orderBy('updateTime', 'desc').skip(skip).limit(limit).get()
  } catch (e) {
    console.error(e)
  }
}