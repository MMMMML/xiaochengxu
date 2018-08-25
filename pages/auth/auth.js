// pages/auth/auth.js
import user from '../../api/user.js'
let app = getApp()
Page({
  data: {
  
  },
  onLoad() {
    let x = getCurrentPages()
  },
  onGotUserInfo (e) {
    let userInfo = e.detail.userInfo
    userInfo.code = app.globalData.code
    user.toAuth(userInfo).then(res => {
      let { sessionId } = res.payload
      wx.setStorageSync('token', sessionId)
      wx.navigateBack({
        delta: 2
      })
    })
  }
})