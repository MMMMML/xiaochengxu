import { serviceDict } from '../../utils/enum.js'

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
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    serviceType: '',
    vehicleNo: ''
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
