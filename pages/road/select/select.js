import until from '../../../utils/util.js'
const date = new Date();
const years = [];
const hours = [];
let dict = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
let getDay = new Date().getDay()
// let value = dict[getDay]
let time = [
  until().format('YYYY/MM/DD') + dict[(getDay) % 7],
  until().add(1, 'DD').format('YYYY/MM/DD') + dict[(getDay + 1) % 7],
  until().add(2, 'DD').format('YYYY/MM/DD') + dict[(getDay + 2) % 7],
  until().add(3, 'DD').format('YYYY/MM/DD') + dict[(getDay + 3) % 7], 
  until().add(4, 'DD').format('YYYY/MM/DD') + dict[(getDay + 4) % 7], 
  until().add(5, 'DD').format('YYYY/MM/DD') + dict[(getDay + 5) % 7], 
  until().add(6, 'DD').format('YYYY/MM/DD') + dict[(getDay + 6) % 7],
  until().add(7, 'DD').format('YYYY/MM/DD') + dict[(getDay + 7) % 7]]

time.forEach((item, index) => {
  console.log()
  years.push(item);
})

let sec = ['尽快','00:00','00.30','01:00','01:30','02:00','02:30','03:00','03:30','04:00','04:30','05:00',
            '05:30','06:00','06:30','07:00','07:30','08:00','08:30','09:00','09:30','10:00','10:30',
            '11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00',
            '16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30',
            '22:00','22:30','23:00','23:30']
let nowhour = until().format('hh:mm')
console.log(until().format('hh:mm'))

sec.forEach((item, index) => {
  if (nowhour < item ){
    hours.push("" + item);
  }
})



Page({
  data: {
    time: '',
    multiArray: [years,hours],
    multiIndex: [0, 0],
  },
  //获取时间日期
  bindMultiPickerChange: function (e) {
    console.log(e)
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
    const index = this.data.multiIndex;
    const year = this.data.multiArray[0][index[0]]
    // const month = this.data.multiArray[1][index[1]]
    // const day = this.data.multiArray[2][index[2]]
    const hour = this.data.multiArray[1][index[1]]
    // const minute = this.data.multiArray[4][index[4]]
    this.setData({
      time: year  + hour
    })
    console.log(this.data.time);
  },
  //监听picker的滚动事件
  bindMultiPickerColumnChange: function (e) {
    // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data);
  },

})