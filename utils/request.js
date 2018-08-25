// import { Token } from 'token.js'
import Config from 'config.js'
class Base {
  constructor() {
    this.baseUrl = Config.baseUrl
  }

  request(params) {
    let url = params.setUpUrl === false ? params.url : `${this.baseUrl}${params.url}`

    let contentType
    if (params.contentType) {
      contentType = params.contentType
    } else {
      contentType = params.type === 'post' ? 'application/x-www-form-urlencoded' : 'application/json'
    }

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
              // 401处理 （如果未授权，需要跳转到Auth页面）
              wx.navigateTo({
                url: '/pages/auth/auth'
              })
            }
          }
        }
      })
    })
  }
}

export default Base