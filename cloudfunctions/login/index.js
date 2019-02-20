// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const db = cloud.database({
    env: process.env.env
  })

  try {
    return await db.collection('admin').where({
      openid: OPENID
    }).get()
  } catch (e) {
    console.error(e)
  }
}
