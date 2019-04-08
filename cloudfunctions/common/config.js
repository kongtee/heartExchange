// 配置文件
const cloud = require('wx-server-sdk')

cloud.init()

module.exports = async () => {
  const db = cloud.database({
    env: process.env.env
  })
  
  try {
    const config = await db.collection('config').limit(1).get()
    return config.data[0]
  } catch(e) {
    return {
      errMsg: `获取配置信息失败：${e}`
    }
  }
}