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
  // const id = event.id
  // const proType = event.proType
  // let where = {}
  // if (proType) {
  //   if (proType === '1') {
  //     where = {
  //       proType: proType
  //     }
  //   } else {
  //     where = {
  //       proType: db.command.neq('1')
  //     }
  //   }
  // }

  try {
    // if (id) {
    //   // 查询一条信息
    //   return await db.collection('servicers').doc(id).get()
    // } else {
      // return await db.collection('orders').where(where).skip(skip).limit(limit).get()

    return await db.collection('orders').orderBy('updateTime', 'desc').skip(skip).limit(limit).get()
    // }
  } catch (e) {
    console.error(e)
  }
}