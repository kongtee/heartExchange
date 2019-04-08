// pages/personal/settings/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 跳转到客服认证页
   */
  onServiceAuth() {
    wx.navigateTo({
      url: '/pages/personal/settings/servicerAuth',
    })
  }
})