// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database({
    env: process.env.env
  })

  const id = event.id

  try {
    return await db.collection('servicers').doc(id).update({
      // data 字段表示需新增的 JSON 数据
      data: {
        nickName: event.nickName,
        trueName: event.trueName,
        sex: event.sex,
        // age: event.age,
        // skill: event.skill,
        weixin: event.weixin,
        qq: event.qq,
        telphone: event.telphone,
        updateTime: db.serverDate()
      }
    })
  } catch (e) {
    console.error(e)
  }
}