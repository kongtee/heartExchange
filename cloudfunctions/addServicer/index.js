// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database({
    env: process.env.env
  })
  
  const res = await db.collection('servicers').orderBy('createTime', 'desc').limit(1).get()

  const no = res.data[0].servicerNo
  const servicerNo = (Array(4).join(0) + (parseInt(no) + 1)).slice(-4)

  try {
    return await db.collection('servicers').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        servicerNo: servicerNo,
        nickName: event.nickName,
        trueName: event.trueName,
        avatarId: event.avatarId,
        sex: event.sex,
        idcard: event.idcard,
        // age: event.age,
        // skill: event.skill,
        weixin: event.weixin,
        qq: event.qq,
        telphone: event.telphone,
        maritalIndex: event.maritalIndex,
        price: event.price,
        updateTime: db.serverDate(),
        createTime: db.serverDate()
      }
    })
  } catch (e) {
    console.error(e)
  }
}