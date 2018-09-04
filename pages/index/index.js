
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
    colse:true,
    list: [],
    markers:[{
      iconPath: "../../images/address.png",
      id: 0,
      latitude:'',
      longitude:'',
      width: 25,
      height: 25,
      callout:{
        content: '故障点',
        color: '#272727',
        fontSize: 12,
        bgColor: '#ffffff',
        padding:3,
        display: 'ALWAYS',
        borderRadius:5
      }
    }]

  },
  onLoad() {
    this.mapsCtx = wx.createMapContext('myMaps')
    this.mapCtx = wx.createMapContext('myMap')
    this.getPosition()
    // this.priceDesc(1)
  },
  onShow() {
    let value = wx.getStorageSync('getVehiclename')
    this.setData({
      carName: value
    })
  },
  noTouch:function () {
    return;
  }, 
  close(){
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
  // kepu(){
  //   console.log('~~~~~~~~~!!!!!!!!!')
  // },
  /**
   * 地图上定位到当前位置
   */
  moveto(e) {
    const { type } = e.currentTarget.dataset
    if (type == 1) {
      this.mapCtx.moveToLocation()
    } else {
      this.mapsCtx.moveToLocation()
      
    }
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
    let that = this
    const { type } = e.currentTarget.dataset
    let { step, params } = this.data
    if (step == 1) {
      if (params.rescueType == 1 || params.rescueType == 3){
        if (!params.rescueOrderInfo.endPosition){
          wx.showToast({
            title: '请选择目的地址',
            duration: 3000,
            icon:'none'
          })
          return
        }
        
        const { startLat, startLng, endLat, endLng } = params.rescueOrderInfo
        let paramss = {
          fromLng: startLng,
          formLat: startLat,
          toLng: endLng,
          toLat: endLat
        }
        road.getdistance(paramss).then(data=>{
          console.log(22,data)
          if (type === 'add') {
            step++
          } else {
            step--
          }
          let distance = data.payload.result.elements[0].distance
          that.setData({
            params: {
              ...params,
              rescueOrderInfo: {
                ...params.rescueOrderInfo,
                reckonDistance: distance
              }
            },
            step
          })
        })
      } else {
        if (type === 'add') {
          step++
        } else {
          step--
        }

        this.setData({
          step
        })
      }
    } else {
      if (step == 2 && type == 'add') {
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
      if (step == 3 && type == 'add') {
        if (!params.name) {
          wx.showToast({
            title: '请输入联系人',
            duration: 3000,
            icon: 'none'
          })
          return
        }
        if (!params.mobile) {
          wx.showToast({
            title: '请输入手机号码',
            duration: 3000,
            icon: 'none'
          })
          return
        }
        if (!params.verify) {
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
            if (res.code == 200) {
              wx.removeStorageSync('getVehiclename')
              this.setData({
                step: 1
              })
              let result = res.payload.id
              wx.navigateTo({
                url: `../road/order/order?id=${result}`,
              })

            }
            if (res.code == 500) {
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
    }
    
  },

  priceDesc(flag) {
    let type = this.data.params.rescueType || 4
    wx.navigateTo({
      url: `../price/price?type=${type}`,
    })
    
    
  },

  handleStepOne(e) {
    const { detail } = e
    let { params, markers } = this.data
    params = {
      ...params,
      ...detail
    }
    const { startLat, startLng, endLat, endLng } = detail.rescueOrderInfo

    this.setData({
      params,
      markers: [{
        ...markers[0],
        latitude: startLat,
        longitude: startLng
      }],
      latitude: startLat,
      longitude: startLng
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
                   