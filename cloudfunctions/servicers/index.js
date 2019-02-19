// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('云函数入口函数')
  const db = cloud.database({
    env: 'test-521157'
  })

  // const todo = db.collection('todos').doc('todo-identifiant-aleatoire')

  // return todo

  // const servicers = db.collection('servicers')

  // return servicers;
  // servicers.where({

  // }).get().then(res=>{
  //   return res;
  // }).catch(e => {
  //   console.log(e)
  //   return e
  // })
  const time = db.serverDate();
  // return '添加'
  try {
    return await db.collection('servicers').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        nickName: event.nickName,
        trueName: event.trueName,
        sex: event.sex,
        // age: event.age,
        // skill: event.skill,
        weixin: event.weixin,
        qq: event.qq,
        telphone: event.telphone,
        updateTime: time,
        createTime: time
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