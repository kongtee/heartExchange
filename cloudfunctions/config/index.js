// 云函数入口函数
exports.main = async (event, context) => {
  return {
    secret: '3b2b4c07aa4a29a684e9b0260efa5ffd',  // AppSecret
    touser: 'oc7Er5Nv_i-J0deQoatSjpBe8y9o',  // 接收者（用户）的 openid（阿连）
    template_id: 'EloOLhY6sHUlNRHmhtsIvmH4Ja4qHc_BLOBBC22HYxk',  // 所需下发的模板消息的id
  }
}