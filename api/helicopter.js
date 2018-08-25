import Base from '../utils/request.js'

class User extends Base {
  constructor() {
    super()
  }

  // 获取手机号
  getphone(params) {
    return this.request({
      url: 'incallWechatMini/auth/decryptData',
      type: 'post',
      data: params
    })
  }

  //一键呼救
  makecall(params) {
    return this.request({
      url: 'incallWechatMini/call/callRecord',
      type: 'post',
      data: params
    })
  }
}

export default new User()