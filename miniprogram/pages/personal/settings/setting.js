// pages/personal/settings/setting.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    version: 'V1.0.0'
  },  
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '心灵交换 - 设置'
    })

    this.setData({
      version: app.globalData && app.globalData.version || 'V1.0.0'
    })
  },

  /**
   * 跳转到客服认证页
   */
  onServiceAuth() {
    wx.navigateTo({
      url: '/pages/personal/settings/servicerAuth',
    })
  },

  /**
   * 跳转到关于页面
   */
  onAbout() {
    wx.navigateTo({
      url: '/pages/personal/settings/about',
    })
  }
})