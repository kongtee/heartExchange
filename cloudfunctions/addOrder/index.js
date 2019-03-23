// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database({
    env: process.env.env
  })

  try {
    return await db.collection('orders').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        outTradeNo: event.outTradeNo,
        servicerNo: event.servicerNo,
        nickName: event.nickName,
        proType: event.proType,
        exchangeType: event.exchangeType,
        time: event.time,
        price: event.price,
        orderTime: event.orderTime,
        custWeixin: event.custWeixin,
        memo: event.memo,
        updateTime: db.serverDate(),
        createTime: db.serverDate()
      }
    })
  } catch (e) {
    console.error(e)
  }
  // const wxContext = cloud.getWXContext()

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}