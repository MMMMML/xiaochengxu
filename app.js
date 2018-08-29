//app.js
import user from './api/user.js'
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res)
        let params = { code: res.code} 
        user.toAuth(params).then(data=>{
          console.log(data)
          if(data.code==200){
            console.log(123)
            wx.setStorageSync('token', data.payload.sessionId)
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // console.log(res)
              // 可以将 res 发送给后台解码出 unionId
              // let { nickName, city, country, gender, language, avatarUrl, province} = res.userInfo
              // let params = {
              //   nickName,
              //   city,
              //   country,
              //   gender,
              //   language,
              //   avatarUrl,
              //   province
              // }
              // user.WxUserInfo(params).then(data=>{
              //     console.log(data)
              // })

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})