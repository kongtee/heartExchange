// pages/personal/settings/about.js
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
      title: '心灵交换 - 关于'
    })

    this.setData({
      version: app.globalData && app.globalData.version || 'V1.0.0'
    })
  }
})