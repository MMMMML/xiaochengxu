import { serviceDict } from '../../utils/enum.js'
import road from '../../api/road.js'

const basePriceDict = {
  1: 498,
  2: 100,
  3: 198,
  4: 100
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    positionInfo: {
      type: Object,
      value: {},
      observer() {
        this.toParent()
      }
    },
    step: {
      type: Number,
      value: 4,
      observer(newVal) {
        console.log('!!!!!!!!!!')
        this.setData({
          select: newVal || 4,
          rescueType: serviceDict[newVal || 4],
          basePrice: basePriceDict[newVal || 4]
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    select: 4,
    rescueType: '搭电',
    pro1: false,
    pro2: false,
    basePrice: 100,
    addPrice: 0,
    endPositionInfo: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    selected(e) {
      const { select } = e.currentTarget.dataset

      this.setData({
        select,
        rescueType: serviceDict[select],
        basePrice: basePriceDict[select]
      }, () => {
        this.toParent()
      })
    },
    selectPro(e) {
      const { type } = e.currentTarget.dataset
      let { pro1, pro2 } = this.data
      if (type === '车在地库') {
        pro1 = !pro1
      } else {
        pro2 = !pro2
      }

      let addPrice = 0
      if (pro1 && pro2) {
        addPrice = 200
      } else if (!pro1 && !pro2) {
        addPrice = 0
      } else {
        addPrice = 100
      }
      this.setData({
        pro1,
        pro2,
        addPrice
      }, () => {
        this.toParent()
      })
    },
    makecall(){
      wx.makePhoneCall({
        phoneNumber: '400-111-9299' 
      })
    },
    chooseLocation(e) {
      const that = this
      const { type } = e.currentTarget.dataset
      wx.chooseLocation({
        success(res) {
          const { address, latitude, longitude, name } = res
          let params
          if (type === 'start') {
            params = {
              positionInfo: {
                address: `${address}${name}`,
                latitude,
                longitude
              }
            }
          } else {
            params = {
              endPositionInfo: {
                address: `${address}${name}`,
                latitude,
                longitude
              }
            }
          }
          
          that.setData(params, () => {
            that.toParent()
          })
        }
      })
    },
    toParent() {
      const { select, rescueType, pro1, pro2, positionInfo, basePrice, endPositionInfo, addPrice } = this.data
      
      let obj = {
        rescueType: select,
        position: positionInfo.address,
        totalPrice: (basePrice + addPrice) * 100
      }

      // 1 和 3多余的参数
      let addObj = {}

      let priceList = []
      priceList.push({
        name: rescueType,
        price: basePrice * 100,
        type: 1
      })

      addObj = {
        rescueOrderInfo: {
          startLat: positionInfo.latitude,
          startLng: positionInfo.longitude,
          startPosition: positionInfo.address,
          reckonPrice: (basePrice + addPrice) * 100,
          reckonDistance: 0
        }
      }
      if (select == 1 || select == 3) {

        if (pro1) {
          priceList.push({
            name: '车在地库',
            price: 10000,
            type: 2
          })
        }
        if (pro2) {
          priceList.push({
            name: '需要附轮',
            price: 10000,
            type: 2
          })
        }

        addObj = {
          rescueOrderInfo: {
            ...addObj.rescueOrderInfo,
            endPosition: endPositionInfo.address,
            endLng: endPositionInfo.longitude,
            endLat: endPositionInfo.latitude
          }
        }
      }

      obj = {
        ...obj,
        priceList,
        ...addObj
      }

      this.triggerEvent('stepone', obj)
    }
  }
})
