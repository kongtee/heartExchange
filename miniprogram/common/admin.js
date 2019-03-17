module.exports = {
  /**
   * 获取管理员权限
   */
  getAdmin: function() {
    try {
      // 获取管理员信息
      const admin = wx.getStorageSync('admin')
    if(admin) {
        // 存在管理员信息先清除掉
        wx.removeStorage({
          key: 'admin'
        })
      } else {
        // 获取管理员信息
        wx.cloud.callFunction({
          name: 'login'
        }).then(res => {
          if (res.result.data.length > 0) {
            wx.redirectTo({
              url: '/pages/admin/users/admin',
            })
          }
        }).catch(console.error)
      }
    } catch(e) {
      console.err('获取本地admin参数失败')
    }
  }
}