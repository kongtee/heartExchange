// 云函数入口函数
const cloud = require('wx-server-sdk')

cloud.init()

exports.main = async (event, context) => {
  const db = cloud.database({
    env: process.env.env
  })
   
  return event.x + event.y
}