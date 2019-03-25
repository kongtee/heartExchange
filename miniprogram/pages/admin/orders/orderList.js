// pages/admin/orders/orderList.js
const Date = require('../../../common/date')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    skip: 0,
    limit: 20,
    end: false,   // 是否还有数据
    proType: ['业余', '专业']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '后台管理 - 订单列表'
    })

    this.getOrderList()
  },

  /**
   * 获取订单列表
   */
  getOrderList() {
    wx.cloud.callFunction({
      name: 'getOrderList',
      data: {
        skip: this.data.skip,
        limit: this.data.limit
      }
    }).then(res => {
      console.log('成功：', res.result)
      const data = res.result.data || []
      const listData = this.data.listData.concat(data)
      for (let data of listData) {
        data.orderTime = new Date(data.orderTime * 1000).Format('yyyy-MM-dd hh:mm:ss')
      }
      if (data.length < this.data.limit) {
        this.setData({
          listData,
          end: true
        })
      } else {
        this.setData({ listData })
      }
    }).catch(console.error)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.end) {
      this.setData({
        skip: this.data.skip + this.data.limit
      })

      this.getServicers()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})