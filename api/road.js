import Base from '../utils/request.js'

class User extends Base {
  constructor() {
    super()
  }

  // 获取品牌车型
  getVehicle() {
    return this.request({
      url: 'incallWechatMini/vehicle/getVehicleBrandList',
      type: 'post'
    })
  }

  // 获取品牌下车型
  VehicleModelList(params) {
    return this.request({
      url: 'incallWechatMini/vehicle/getVehicleModelList',
      type: 'post',
      data: params
    })
  }

  //获取验证码
  getcode(params) {
    return this.request({
      url: '/common/sendVCode',
      type: 'post',
      data: params
    })
  }

  // 下订单咯
  createOrder(data) {
    return this.request({
      url: 'incallWechatMini/rescueOrder/create',
      type: 'post',
      data,
      contentType: 'application/json'
    })
  }

  //获取订单详情
  getOrder(params) {
    return this.request({
      url: 'incallWechatMini/rescueOrder/getOrder',
      type: 'post',
      data: params
    })
  }

  //获取订单列表
  getList(params) {
    return this.request({
      url: 'incallWechatMini/rescueOrder/getList',
      type: 'post',
      data: params
    })
  }

  //支付
  payment(params) {
    return this.request({
      url: 'incallWechatMini/rescueOrder/payOrder',
      type: 'post',
      data: params
    })
  }
  //取消订单
  cancelorder(params) {
    return this.request({
      url: 'incallWechatMini/rescueOrder/cancelOrder',
      type: 'post',
      data: params
    })
  }
  //设置订单超时
  setTimeOut(params) {
    return this.request({
      url: 'incallWechatMini/rescueOrder/setTimeOut',
      type: 'post',
      data: params
    })
  }
}

export default new User()