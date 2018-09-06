// import { Token } from 'token.js'
import Config from 'config.js'
class Base {
  constructor() {
    this.baseUrl = Config.baseUrl
  }

  request(params) {
    let url = params.setUpUrl === false ? params.url : `${this.baseUrl}${params.url}`
    let that = this
    let contentType
    if (params.contentType) {
      contentType = params.contentType
    } else {
      contentType = params.type === 'post' ? 'application/x-www-form-urlencoded' : 'application/json'
    }
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    return new Promise((resolve, reject) => {
      wx.request({
        url,
        data: params.data,
        method: params.type || 'get',
        header: {
          'content-type': contentType,
          'sessionId': wx.getStorageSync('token'),
          'X-WxFrom': 5
        },
        success(res) {
          let code = res.statusCode.toString()
          if (code == 200) {
            resolve(res.data)
          } else {
            if (code == 401) {
              /**
               *  401时，判断用户是否需要更新信息
               *  需要更新就直接跳转到auth页面
               *  不需要更新 1，保存token 2，重新请求，并把data抛出
              */
              wx.login({
                success: res => {
                  const { code } = res
                  wx.showLoading({
                    title: '加载中',
                    mask: true
                  })
                  wx.request({
                    url: `${that.baseUrl}/incallWechatMini/auth/login`,
                    method: 'post',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded',
                      'sessionId': wx.getStorageSync('token'),
                      'X-WxFrom': 4
                    },
                    data: { code },
                    success(res) {
                      const { sessionId } = res.data.payload
                      wx.setStorageSync('token', sessionId)
                      that.request(params).then(res => {
                        resolve(res)
                      })
                    },
                    complete(res) {
                      wx.hideLoading()
                    }
                  })
                }
              })
            }
          }
        },
        complete() {
          wx.hideLoading()
        }

      })
    })
  }
}

export default Base