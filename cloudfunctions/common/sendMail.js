// 发送邮件
const cloud = require('wx-server-sdk')
const Config = require('./config')
const nodemailer = require("nodemailer")
const Date = require('./date')

cloud.init({
  env: process.env.env
})

module.exports = async (option) => {
  const config = await Config()

  const transporter = nodemailer.createTransport({
    service: config.mail.service,
    port: config.mail.port,  // SMTP 端口
    secureConnection: true,  // 使用 SSL
    auth: {
      user: config.mail.from,   //发邮件邮箱
      pass: config.mail.smtp_pass     //qq邮箱授权码
    }
  });

  const proType = ['业余', '专业']
  // 支付信息模板
  const payHtml = [
    '<h3>支付信息</h3>',
    '<table border="1">',
    '<tr>',
    `<td>单号</td>`,
    `<td>${option.outTradeNo}</td>`,
    '</tr>',
    '<tr>',
    '<td>客服</td>',
    `<td>${option.serviceNickName || '随机'}（${option.servicerNo}）</td>`,
    '</tr>',
    '<tr>',
    '<td>类型</td>',
    `<td>${proType[option.proType]}-${option.exchangeType}</td>`,
    '</tr>',
    '<tr>',
    '<td>时长</td>',
    `<td>${option.time / 60}小时</td>`,
    '</tr>',
    '<tr>',
    '<td>价格</td>',
    `<td>${option.price / 100}</td>`,
    '</tr>',
    '<tr>',
    '<td>订单时间</td>',
    `<td>${option.orderTime}</td>`,
    '</tr>',
    '<tr>',
    '<td>订单时间</td>',
    `<td>${new Date(option.orderTime * 1000 + (8 * 60 * 60 * 1000)).Format("yyyy-MM-dd hh:mm:ss")}</td>`,
    '</tr>',
    '<tr>',
    '<td>用户昵称</td>',
    `<td>${option.custNickName}</td>`,
    '</tr>',
    '<tr>',
    '<td>联系方式</td>',
    `<td>${option.telphone}</td>`,
    '</tr>',
    '</table>'
  ].join('')

  // 分配信息模板
  const dispatchHtml = [
    '<h3>分配信息</h3>',
    '<table border="1">',
    '<tr>',
    `<td>单号</td>`,
    `<td>${option.outTradeNo}</td>`,
    '</tr>',
    '<tr>',
    '<td>分配客服</td>',
    `<td>${option.serviceNickName}（${option.servicerNo}）</td>`,
    '</tr>',
    '<tr>',
    '<td>类型</td>',
    `<td>${proType[option.proType]}-${option.exchangeType}</td>`,
    '</tr>',
    '<tr>',
    '<td>时长</td>',
    `<td>${option.time / 60}小时</td>`,
    '</tr>',
    '<tr>',
    '<td>价格</td>',
    `<td>${option.price / 100}</td>`,
    '</tr>',
    '<tr>',
    '<td>订单时间</td>',
    `<td>${option.orderTime}</td>`,
    '</tr>',
    '<tr>',
    '<td>订单时间</td>',
    `<td>${new Date(option.orderTime * 1000 + (8 * 60 * 60 * 1000)).Format("yyyy-MM-dd hh:mm:ss")}</td>`,
    '</tr>',
    '<tr>',
    '<td>用户昵称</td>',
    `<td>${option.custNickName}</td>`,
    '</tr>',
    '<tr>',
    '<td>联系方式</td>',
    `<td>${option.telphone}</td>`,
    '</tr>',
    '</table>'
  ].join('')

  let html = payHtml
  let subject = '支付消息'
  if (option.mailType === 'dispatch') {
    html = dispatchHtml
    subject = '分配订单消息'
  }

  const mailOptions = {
    from: config.mail.from,   // 发件地址
    to: '79959261@qq.com', //config.mail.to.join(','),    // 收件列表
    subject: subject,      // 标题
    html: html
  };

  return await transporter.sendMail(mailOptions);
}