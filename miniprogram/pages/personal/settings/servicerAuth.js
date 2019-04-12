// pages/personal/settings/servicerAuth.js
const validate = require('../../../common/validate')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputFields: {
      servicerNo: {
        name: 'servicerNo',
        placeholder: '请输入客服编号',
        errMsg: '',
        errClass: ''
      },
      servicerCode: {
        name: 'servicerCode',
        placeholder: '请输入客服认证码',
        errMsg: '',
        errClass: ''
      }
    },
    servicerNoErr: true,
    servicerCodeErr: true,
    rules: {
      servicerNo: [
        { required: true, message: '请输入客服编号', trigger: 'blur' }
      ],
      servicerCode: [
        { required: true, message: '请输入请输入客服认证码', trigger: 'blur' }
      ]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '心灵交换 - 客服认证'
    })
  },

  /**
   * 认证
   */
  onAuth(e) {
    console.log('onAuth:', e)
    const value = e.detail.value
    validate(value, this.data.rules, (res) => {
      if (!res.valid) {
        console.log('valid:', res)
        const data = { ...this.data.inputFields}
        data[res.errKey].errClass = 'error'
        data[res.errKey].errMsg = this.data.rules[res.errKey][res.errNo].message
        
        this.setData({
          inputFields: data
        })
        return
      } 

      wx.cloud.callFunction({
        name: 'servicerAuth',
        data: {
          servicerNo: value.servicerNo,
          servicerCode: value.servicerCode
        }
      }).then(res => {
        if (res.result.stats.updated) {
          wx.showToast({
            title: '认证成功',
            icon: 'success'
          })
        } else {
          wx.showToast({
            title: '认证失败',
            icon: 'none'
          })
        }
        console.log('result:', res.result)
      }).catch(console.error)

    })
  }
})