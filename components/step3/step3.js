import { serviceDict } from '../../utils/enum.js'
import road from '../../api/road.js';
import until from '../../utils/util.js'
const date = new Date();
const years = [];
const hours = [];
let dict = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
let getDay = new Date().getDay()
// let value = dict[getDay]
let time = [
  until().format('YYYY-MM-DD') + dict[(getDay) % 7],
  until().add(1, 'DD').format('YYYY-MM-DD') + dict[(getDay + 1) % 7],
  until().add(2, 'DD').format('YYYY-MM-DD') + dict[(getDay + 2) % 7],
  until().add(3, 'DD').format('YYYY-MM-DD') + dict[(getDay + 3) % 7],
  until().add(4, 'DD').format('YYYY-MM-DD') + dict[(getDay + 4) % 7],
  until().add(5, 'DD').format('YYYY-MM-DD') + dict[(getDay + 5) % 7],
  until().add(6, 'DD').format('YYYY-MM-DD') + dict[(getDay + 6) % 7],
  until().add(7, 'DD').format('YYYY-MM-DD') + dict[(getDay + 7) % 7]]

time.forEach((item, index) => {
  years.push(item);
})
let sec = ['尽快到达', '00:00', '00.30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00',
  '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00',
  '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
  '22:00', '22:30', '23:00', '23:30']
let nowhour = until().format('hh:mm')

sec.forEach((item, index) => {
  if (nowhour < item) {
    hours.push("" + item);
  }
})


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    rescueType: {
      type: String,
      value: '',
      observer(newVal) {
        console.log(serviceDict[newVal])
        this.setData({
          serviceType: serviceDict[newVal]
        })
      }
    },
    totalPrice: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    mobile:'',
    time: '',
    multiArray: [years, hours],
    multiIndex: [0, 0],
    params: {},
    serviceType: '',
    getmsg:'获取验证码',
    isGet: false,
    sec: 60
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindKeyInput: function (e) {
        this.mobile=e.detail.value
    },
    getcode(){
      let params = {
        mobile: this.data.params.mobile,
        type: 'rescueVerify'
      }
      road.getcode(params).then(data=>{
        if(data.code==200){
          wx.showToast({
            title: '验证码已发送',
            duration: 3000,
            icon: 'success'
          })
          var self = this
          self.setData({ isGet: true })
          var remain = 60;
          var time = setInterval(function () {
            if (remain == 1) {
              clearInterval(time)
              self.setData({
                sec: 60,
                isGet: false
              })
              return false
            }
            remain--;
            self.setData({
              sec: remain
            })
          }, 1000)
        }
        
        if(data.code==500){
          wx.showToast({
            title: data.message,
            duration: 3000,
            icon: 'none'
          })
        }
      })
    },
    bindMultiPickerChange: function (e) {
      this.setData({
        multiIndex: e.detail.value
      })
      const index = this.data.multiIndex;
      const year = this.data.multiArray[0][index[0]].substring(0,10)
      const hour = this.data.multiArray[1][index[1]]
      let x
      if(hour=='尽快到达') {
        x = ''
      } else {
        x = `${year} ${hour}`
      }
      this.setData({
        params: {
          rescueTime: x
        }
      }, () => {
        this.triggerEvent('stepthree', this.data.params)
      })
    },
    bindMultiPickerColumnChange: function (e) {
      console.log(e.detail)
      // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
      var data = {
        multiArray: this.data.multiArray,
        multiIndex: this.data.multiIndex
      };
      data.multiIndex[e.detail.column] = e.detail.value;
      let hours = []
      if (data.multiIndex[0] > 0) {
        for (let i = 1; i < sec.length; i++) {
          hours.push(sec[i])
        }
      } else {
        let nowhour = until().format('hh:mm')
        console.log(2)
        sec.forEach((item, index) => {
          if (nowhour < item) {
            hours.push("" + item);
          }
        })
      }
      console.log(hours)
      data.multiArray[1] = hours
      this.setData(data);
    },
    handleInput(e) {
      const { type } = e.currentTarget.dataset
      const value = e.detail.value
      let { params } = this.data
      this.setData({
        params: {
          ...params,
          [type]: value
        }
      }, () => {
        this.triggerEvent('stepthree', this.data.params)
      })
    }
  }
})
