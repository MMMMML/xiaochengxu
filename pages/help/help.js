// pages/help/help.js
import helicopter from '../../api/helicopter.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude:"",
    longitude:'',
    phone:'',
    mobile:''
  },
  getPosition() {
    let _this = this
    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        console.log(res)
        var latitude = res.latitude
        var longitude = res.longitude
        _this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
      }
    })
  },
 
    getPhoneNumber: function (e) {
      let params = {
        iv: e.detail.iv,
        encryptedData: e.detail.encryptedData
      }
      helicopter.getphone(params).then(data=>{
        console.log(data)
        this.mobile = data.payload.phoneNumber
        let params = {
          mobile:this.mobile, 
          longitude: this.data.longitude,
          latitude: this.data.latitude,
          source:'flashelp'
        }
        helicopter.makecall(params).then(data=>{
          console.log(data)
          if(data.code==200){
            wx.makePhoneCall({
              phoneNumber: '400-111-9299' //仅为示例，并非真实的电话号码
            })
          }
        })
      })
    },
  must(){
      if(this.phone){
        if (!(/^1[34578]\d{9}$/.test(this.phone))) {
          wx.showToast({
            title: '请输入正确的手机号',
            icon: 'none',
            duration: 2000
          })
          return
        }
      }

    if (this.phone == undefined) {
      this.phone = ''
    }
    let params = {
      mobile: this.phone,
      longitude: this.data.longitude,
      latitude: this.data.latitude,
      source: 'flashelp'
    }
    helicopter.makecall(params).then(data => {
      console.log(data)
      if (data.code == 200) {
        wx.makePhoneCall({
          phoneNumber: '400-111-9299' //仅为示例，并非真实的电话号码
        })
      }
    })
  },
  bindKeyInput:function(e){
    this.phone = e.detail.value
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPosition()
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