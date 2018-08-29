// pages/road/order/order.js
import road from '../../../api/road.js'
import Miment from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:'',
    orderId:'',
    x: '',
    text: '确认支付'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.id
    })
    let params = {
      orderId: this.data.orderId
    }
    road.getOrder(params).then(data=>{
      let result = data.payload
      let member = data.payload.member
      this.id = data.payload.id
      this.createTime = data.payload.createTime
      if(member){
        this.setData({
          text: '确认救援'
        })
      }
      let dis = data.payload.timeout / 1000 | 0
      let timer = setInterval(() => {
        if (dis > 0) {
          dis--
          let x = Miment(dis * 1000).format('mm分ss秒')
          this.setData({
            x
          }) 
        } else {
          clearInterval(timer)
          
          road.setTimeOut(params)
        }
      }, 1000)
      this.setData({
        list:result
      })
    })
      
  },
  confirm(){
    const { text } = this.data
    road.payment({ orderId: this.data.orderId}).then(data=>{
      if (text === '确认支付') {
       
        const { timeStamp, nonceStr, signType, paySign } = data.payload
        const { outTradeNo, createTime } = data.payload.businessInfo
        let packages = data.payload.package
        if (data.code == 200) {
          wx.requestPayment({
            'timeStamp': timeStamp,
            'nonceStr': nonceStr,
            'package': packages,
            'signType': signType,
            'paySign': paySign,
            'success': function (res) {
              if (res.errMsg == 'requestPayment:ok') {
                
                wx.redirectTo({
                  url: `../../wait/wait?createTime=${createTime}&outTradeNo=${outTradeNo}`,
                })
              }
            },
            'fail': function (res) {
              wx.hideLoading()
            }
          })
        }
      } else {
        wx.navigateTo({
          url: `../../wait/wait?createTime=${this.createTime}&outTradeNo=${this.id}`,
        })
      }
    })
  },
  makecall(){
    wx.makePhoneCall({
      phoneNumber: '400-111-9299' 
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
 
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})