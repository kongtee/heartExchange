/**
 * 公共云函数入口文件
 * 
 * 功能：
 * 1.获取公共配置（config: true）
 * 2.获取随机字符串（random: 10）
 * 3.发送邮件（sendMail: data）
 * 4.给用户发送消息通知（sendMessage: data）
 *
 * 用法：
 * 通过调用传递配置参数决定返回哪个功能
 * 
 * ex:
 * 获取公共配置： 
  const config = await cloud.callFunction({
    name: 'common',
    data: {
      config: true
    }
  });
 */ 
const cloud = require('wx-server-sdk')
const config = require('./config')
const randomStr = require('./randomStr')
const sendMail = require('./sendMail')
const sendMessage = require('./sendMessage')

cloud.init({
  env: process.env.env
})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database({
    env: process.env.env
  })
  let result = {}

  // 获取配置信息
  if (event.config) {
    result.config = await config()
  }

  // 获取随机数
  if (event.random) {
    result.random = randomStr(event.random)
  }

  // 发送邮件
  if (event.sendMail) {
    result.sendMail = await sendMail(event.sendMail)
  }

  // 给用户发送消息通知
  if (event.sendMessage) {
    result.sendMessage = await sendMessage(event.sendMessage)
  }

  return result
}