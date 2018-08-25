
//获取应用实例
import QQMapWX from '../../utils/qqmap-wx-jssdk.min.js'
import road from '../../api/road.js'
const qqmap = new QQMapWX({
  key: '2JHBZ-UC7WO-MKLWW-SDXUZ-WSI4J-XYF25'
})

Page({
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: 'GPS定位，一键呼救！',
      path: '/pages/index/index?from=help',
      imageUrl: '../img/Catch10E9.jpg'
    }
  },
  data: {
    latitude: "",
    longitude: "",
    positionInfo: {},
    step: 1,
    params: {},
    colse:true
  },
  onLoad() {
    this.mapCtx = wx.createMapContext('myMaps')
    // this.priceTips = {
    //   '4': {
    //     title: '搭电报价',
    //     list: [{
    //       title: '一、道路救援服务基本费用',
    //       texts: ['搭电100元/次;']
    //     },
    //     {
    //       title: '二、道路救援服务可能产生的额外费用',
    //       text: ['因为道路救援存在的不确定性，在救援过程中产生的额外费需由您承担，如产生额外费用，请在服务完成后现场支付给救援人员，额外费用包含但不限于以下几个方面：']
    //     }
    //     ]
    //   }
    // }
    this.getPosition()
  },
  onShow() {
    let value = wx.getStorageSync('getVehiclename')
    this.setData({
      carName: value
    })
  },
  close(){
    console.log(123)
    this.setData({
      close:false
    })
  },
  help() {
    this.getPosition()
    wx.navigateTo({
      url: `../help/help`,
    })
  },

  /**
   * 地图上定位到当前位置
   */
  moveto() {
    this.mapCtx.moveToLocation()
  },

  /**
   * 救援协议
   */
  agreement() {
    wx.navigateTo({
      url: '../agreement/agreement',
    })
  },

  /**
   * 获取当前坐标和位置
   */
  getPosition() {
    let _this = this
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        const { latitude, longitude } = res
        qqmap.reverseGeocoder({
          location: {
            latitude,
            longitude
          },
          success(res) {
            const { address, formatted_addresses } = res.result
            _this.setData({
              positionInfo: {
                address: `${address}${formatted_addresses.recommend}`,
                latitude,
                longitude
              },
              latitude,
              longitude
            })
          }
        })
      }
    })
  },

  changeStep(e) {
    
    const { type } = e.currentTarget.dataset
    let { step, params } = this.data
    if (step == 1) {
      if (params.rescueType == 1 || params.rescueType == 3){
        if (!params.rescueOrderInfo.endPosition){
          wx.showToast({
            title: '请选择结束地址',
            duration: 3000,
            icon:'none'
          })
          return
        }
        
      }
    }
    if(step==2&&type=='add'){
      if (!params.rescueOrderInfo.vehicleNo) {
        wx.showToast({
          title: '请输入车牌号',
          duration: 3000,
          icon: 'none'
        })
        return
      }
      if (!params.rescueOrderInfo.vehicleBrand) {
        wx.showToast({
          title: '请选择车型',
          duration: 3000,
          icon: 'none'
        })
        return
      }
    }
    if (step == 3 && type == 'add'){
      if(!params.name){
        wx.showToast({
          title: '请输入联系人',
          duration: 3000,
          icon: 'none'
        })
        return
      }
      if(!params.mobile){
        wx.showToast({
          title: '请输入手机号码',
          duration: 3000,
          icon: 'none'
        })
        return
      }
      if (!params.verify){
        wx.showToast({
          title: '请输入验证码',
          duration: 3000,
          icon: 'none'
        })
        return
      }
    }
    if (type === 'add') {
      if (step === 3) {
        road.createOrder(params).then(res => {
          console.log(res)
          if(res.code==200){
            let result = res.payload.id
            wx.navigateTo({
              url: `../road/order/order?id=${result}`,
            })
          }
          if(res.code==500){
            wx.showToast({
              title: res.message,
              duration: 3000,
              icon: 'none'
            })
          }
        })
      } else {
        step++
      }
    } else {
      step--
    }

    this.setData({
      step
    })
  },

  priceDesc() {
    this.setData({
      close:true
    })
  },

  handleStepOne(e) {
    const { detail } = e
    let { params } = this.data
    params = {
      ...params,
      ...detail
    }

    this.setData({
      params
    })
  },

  handleStepTwo(e) {
    const { detail } = e
    let { params } = this.data

    params = {
      ...params,
      rescueOrderInfo: {
        ...params.rescueOrderInfo,
        ...detail
      }
    }

    this.setData({
      params
    })
  },

  handleStepThree(e) {
    const { detail } = e
    let { params } = this.data
    params = {
      ...params,
      ...detail
    }

    this.setData({
      params
    })
  }
})
