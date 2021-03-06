// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database({
    env: process.env.env
  })

  try {
    const addResult = await db.collection('orders').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        outTradeNo: event.outTradeNo,
        avatarId: event.avatarId,
        servicerNo: event.servicerNo,
        serviceNickName: event.serviceNickName,
        proType: event.proType,
        exchangeType: event.exchangeType,
        time: event.time,
        price: event.price,
        orderTime: event.orderTime,
        custOpenid: event.custOpenid,
        custNickName: event.custNickName,
        telphone: event.telphone,
        memo: event.memo,
        status: event.status,
        updateTime: db.serverDate(),
        createTime: db.serverDate()
      }
    })
    if (event.status === '已支付') {
      return await cloud.callFunction({
        name: 'common',
        data: {
          sendMail: event,
          sendMessage: event
        }
      })
    } else {
      return addResult
    }
  } catch (e) {
    console.error(e)
  }
}