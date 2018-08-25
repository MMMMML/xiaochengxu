import Base from '../utils/request.js'

class User extends Base {
  constructor() {
    super()
  }

  // 拿到token
  toAuth(params) {
    return this.request({
      url: 'incallWechatMini/auth/login',
      type: 'post',
      data: params
    })
  }
}

export default new User()