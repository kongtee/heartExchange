// pages/admin/orders/orderList.js
const Date = require('../../../common/date')
const validate = require('../../../common/validate')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    skip: 0,
    limit: 20,
    end: false,   // 是否还有数据
    proType: ['业余', '专业'],
    curOutTradeNo: '',
    dispatchHidden: true,
    inputFields: {
      servicerNo: {
        name: 'servicerNo',
        placeholder: '请输入客服编号',
        errMsg: '',
        errClass: ''
      }
    },
    rules: {
      servicerNo: [
        { required: true, message: '请输入客服编号' }
      ]
    }
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
        data.orderFullTime = new Date(data.orderTime * 1000).Format('yyyy-MM-dd hh:mm:ss')
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.end) {
      this.setData({
        skip: this.data.skip + this.data.limit
      })

      this.getOrderList()
    }
  },
  /**
   * 分配客服
   */
  onDispatchSevicer(e) {
    console.log('outtradeno:' + e.currentTarget.dataset.outtradeno, 'curOutTradeNo:' +this.data.curOutTradeNo)
    this.setData({
      curOutTradeNo: e.currentTarget.dataset.outtradeno || '',
      dispatchHidden: false
    })
  },
  /**
   * 提交分配
   */
  onSubmitDispatch(e) {
    const value = e.detail.value
    const outTradeNo = this.data.curOutTradeNo
    console.log('outTradeNo:' + outTradeNo)
    if (outTradeNo === '') {
      wx.showToast({
        title: '获取订单号失败',
        icon: 'none'
      })
    }

    validate(value, this.data.rules, (res) => {
      if (!res.valid) {
        console.log('valid:', res)
        const data = { ...this.data.inputFields }
        data[res.errKey].errClass = 'error'
        data[res.errKey].errMsg = this.data.rules[res.errKey][res.errNo].message

        this.setData({
          inputFields: data
        })
        return
      }

      wx.cloud.callFunction({
        name: 'updateOrder',
        data: {
          servicerNo: value.servicerNo,
          outTradeNo
        }
      }).then(res => {
        console.log(res)
        if (res.result.errMsg === 'collection.update:ok') {
          wx.showToast({
            title: '分配成功',
            icon: 'success'
          })

          this.setData({
            dispatchHidden: false
          })
        } else {
          wx.showToast({
            title: '分配失败',
            icon: 'none'
          })
        }
        console.log('result:', res.result)
      }).catch(console.error)

    })
  }
})