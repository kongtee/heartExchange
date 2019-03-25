// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const res = await cloud.callFunction({
    // 要调用的云函数名称
    name: 'config',
    // 传递给云函数的参数
    data: {
      x: 1,
      y: 2,
    }
  })
  return res.result
}