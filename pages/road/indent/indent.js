// pages/road/indent/indent.js
import road from '../../../api/road.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    state:1,
    orderList1: [],
    orderList2: [],
    status: ['待支付', '待救援', '超时', '用户取消', '服务完成', '服务完成'],
    alert:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  selected(e){
    console.log(e)
    let status = e.detail
    let state = status ? 1 : 2
    this.setData({
      state
    }, () => {
      this._getlist()
    })
  },
  everlist(e){
    console.log(e)
    let { id, createTime, showState }= e.currentTarget.dataset.type
    if(showState==0){
      wx.navigateTo({
        url: `../order/order?id=${id}`,
      })
    }else{
      wx.navigateTo({
        url: `../../wait/wait?outTradeNo=${id}&createTime=${createTime}&showState=${showState}`,
      })
    }
    
  },
  everlist2(e){
    console.log(e)
    let id= e.currentTarget.dataset.type
    
    wx.navigateTo({
      url: `../../cancel/cancel?orderId=${id}`,
      })
  },
  onShow(options) {
    this._getlist()
  },
  _getlist(){
    const { state } = this.data
    road.getList({
      state
    }).then(data => {
      let result = data.payload.list
      let orderList = state === 1 ? 'orderList1' : 'orderList2'
      this.setData({
        [orderList]: result
      })
      console.log(data.payload.total)
      if(data.payload.total==0){
        this.setData({
          alert:true
        })
      }else{
        this.setData({
          alert: false
        })
      }
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