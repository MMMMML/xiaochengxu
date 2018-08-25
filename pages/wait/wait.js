// pages/wait/wait.js
import road from '../../api/road.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: '价格太高', value: '价格太高', checked: 'true'},
      { name: '等待时间太长', value: '等待时间太长' },
      { name: '自行解决', value: '自行解决' },
      { name: '师傅无法解决', value: '师傅无法解决' }
    ],
    createTime:'',
    outTradeNo:'',
    show:false,
    reson:''
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      reson: e.detail.value
    })
  },
  cancel(){
    this.setData({
      show:true
    })
  },
  submit(){
    let params = {
      orderId: this.data.outTradeNo,
      cause:this.data.reson
    }
    road.cancelorder(params).then(data=>{
        console.log(data)
        if(data.code==200){
          wx.navigateTo({
            url: `../cancel/cancel?orderId=${this.data.outTradeNo}`,
          })
        }
    })
  },
  quxiao(){
    this.setData({
      show: false
    })
  },
  makecall(){
    wx.makePhoneCall({
      phoneNumber: '400-111-9299'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      createTime: options.createTime,
      outTradeNo: options.outTradeNo,
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})