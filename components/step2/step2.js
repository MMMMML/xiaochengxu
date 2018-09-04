import { serviceDict } from '../../utils/enum.js'
import road from '../../api/road.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    name: {
      type: String,
      value: '',
      observer(value) {
        this.toParent()
      }
    },
    rescueType: {
      type: String,
      value: '',
      observer(newVal) {
        this.setData({
          serviceType: serviceDict[newVal]
        })
      }
    },
    price: {
      type: Number,
      value: 0
    },
    distance:{
      type:Number,
      value:0,
      observer(newVal) {
        this.setData({
          juli: (newVal / 1000).toFixed(1)
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    serviceType: '',
    vehicleNo: '',
    juli: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    choose(){
      wx.navigateTo({
        url: '../../pages/indexes/indexes',
      })
    },
    bindKeyInput: function (e) {
      this.setData({
        vehicleNo: e.detail.value
      }, () => {
        this.toParent()
      })
    },

    toParent() {
      const { vehicleNo, name } = this.data
      this.triggerEvent('steptwo', {
        vehicleBrand: name,
        vehicleNo
      })
    }
  }
})
