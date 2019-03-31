// 云函数入口文件
const cloud = require('wx-server-sdk')
const randomStr = require('./randomStr')

cloud.init({
  env: process.env.env
})

// 云函数入口函数
exports.main = async (event, context) => {
  let result = {}
  if (event.random) {
    result.random = randomStr(event.random.param)
  }
  return result
}