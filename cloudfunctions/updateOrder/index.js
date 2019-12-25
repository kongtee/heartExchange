// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()

  // 搜索条件：订单号
  const condition = {
    outTradeNo: event.outTradeNo
  }

  let data = {}

  const servicerNo = event.servicerNo
  let servicer = null
  if (servicerNo) {
    // 客服编号存在，获取该客服的昵称
    try {
      console.log('updateOrder:', servicerNo)
      servicer = await cloud.callFunction({
        name: 'getServicers',
        data: { servicerNo }
      })
    } catch(e) {
      return {
        errMsg: e
      }
    }

    const res = servicer.result.data
    console.log('getServicers', res)
    const serviceNickName = res[0] && res[0].nickName || ''
 
    data = {
      servicerNo,
      serviceNickName,
      status: event.status,
      updateTime: db.serverDate()
    }

    event.mailType = 'dispatch'
  } else {
    // 如果客服编号不存在，更新订单状态
    data = {
      status: event.status,
      updateTime: db.serverDate()
    }

    event.mailType = 'pay'
  }
 
  try {
    console.log('data:', data, " condition:", condition)
    await db.collection('orders').where(condition).update({
      data
    })
    // let hehe = await db.collection('orders').get()
  } catch (e) {
    console.error(e)
  }

  return await cloud.callFunction({
    name: 'common',
    data: {
      sendMail: event,
      sendMessage: event
    }
  })
}