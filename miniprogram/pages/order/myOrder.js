// pages/order/myOrder.js
const app = getApp()
const getOrderList = require('../../request/getOrderList')

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
      title: '心灵交换 - 我的订单'
    })

    this.getOrderList()
  },

  /**
   * 获取订单列表
   */
  getOrderList() {
    getOrderList({
      cust: true,
      skip: this.data.skip,
      limit: this.data.limit
    }, (data) => {
      let listData = this.data.listData
      listData = listData.concat(data)
      if (data && data.length < this.data.limit) {
        this.setData({
          listData,
          end: true
        })
      } else {
        this.setData({
          listData
        })
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.end) {
      this.setData({
        skip: this.data.skip + this.data.limit
      })

      this.getOrderList()
    }
  }
})