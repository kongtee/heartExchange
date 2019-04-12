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
    servicerNo: event.servicerNo,
    servicerCode: event.servicerCode
  }

  return await db.collection('servicers').where(where).update({
    // data 字段表示需新增的 JSON 数据
    data: {
      openid: wxContext.OPENID,
      updateTime: db.serverDate()
    }
  })
}