// 发送邮件
const cloud = require('wx-server-sdk')
const Config = require('./config')
const randomStr = require('./randomStr')

cloud.init({
  env: process.env.env
})

module.exports = async () => {
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
  const mailOptions = {
    from: config.mail.from,   // 发件地址
    to: config.mail.to.join(','),    // 收件列表
    subject: '测试云函数',      // 标题
    text: '测试云函数'
  };

  return await transporter.sendMail(mailOptions);
}