// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database({
    env: process.env.env
  })
  const _ = db.command
  const skip = event.skip || 0
  const limit = event.limit || 20
  const id = event.id
  const proType = event.proType
  const isServicer = event.servicer
  let where = {
    drop: _.neq(true)
  }
  // 专业类型
  if (proType) {
    if (proType === '1') {
      where.proType = proType
    } else {
      where.proType = _.neq('1')
    }
  }

  // 查询是否是客服
  if (isServicer) {
    where.openid = wxContext.OPENID
  }

  try {
    if (id) {
      // 查询一条信息
      return await db.collection('servicers').doc(id).get()
    } else {
      return await db.collection('servicers').where(where).skip(skip).limit(limit).get()
    } 
  } catch (e) {
    console.error(e)
  }
}