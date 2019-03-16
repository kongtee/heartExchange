/**
 * 生成xml数据
 */
module.exports = function(param) {
  return [
    '<xml>',
    `<appid>${param.appid}</appid>`,
    `<attach>${param.attach}</attach>`,
    `<body>${param.body}</body>`,
    `<mch_id>${param.mch_id}</mch_id>`,
    `<nonce_str>${param.nonce_str}</nonce_str>`,
    `<notify_url>${param.notify_url}</notify_url>`,
    `<openid>${param.openid}</openid>`,
    `<out_trade_no>${param.out_trade_no}</out_trade_no>`,
    `<product_id>${param.product_id}</product_id>`,
    `<sign_type>${param.sign_type}</sign_type>`,
    `<spbill_create_ip>${param.spbill_create_ip}</spbill_create_ip>`,
    `<total_fee>${param.total_fee}</total_fee>`,
    `<trade_type>${param.trade_type}</trade_type>`,
    `<sign>${param.sign}</sign>`,
    '</xml>'
  ].join('')
}
