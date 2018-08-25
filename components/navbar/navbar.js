
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    left: {
      type: String,
      value: ''
    },
    right: {
      type: String,
      value: ''
    },
    order:{
      type: Boolean,
      value: true
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    selected: true,
    selected1: false
  },
  methods: {
    selected: function (e) {
      this.setData({
        selected1: false,
        selected: true
      }, () => {
        this.triggerEvent('selected', this.data.selected)
      })
      
    },
    selected1: function (e) {
      this.setData({
        selected: false,
        selected1: true
      }, () => {
        this.triggerEvent('selected', this.data.selected)
      })
    },
    navto(){
      wx.navigateTo({
        url: '../../pages/road/indent/indent',
      })
    }
  }
})