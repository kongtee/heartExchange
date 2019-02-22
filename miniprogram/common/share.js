module.exports = {
  title: '一大波心灵导师正在等你……',
  path: '/pages/index/index',
  imageUrl: '/images/share.jpg',
  success: function (res) {
    console.log('转发成功')
    // 转发成功
  },
  fail: function (res) {
    console.log('转发失败')
    // 转发失败
  }
}