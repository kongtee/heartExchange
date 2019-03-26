// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: process.env.env
})

// 云函数入口函数
exports.main = async (event, context) => {
  const res = await cloud.callFunction({
    name: 'config'
  })
  return res.result
}