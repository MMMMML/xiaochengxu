import road from '../../api/road.js';
Page({
  data: {
    cities: []
  },
  onChange(event) {
    console.log(event.detail, 'click right menu callback data')
    const { index, current } = event.detail
    wx.pageScrollTo({
      scrollTop: current.top,
      duration: 300
    })
  },
  onReady() {
    road.getVehicle().then(data=>{
      let storeCity = new Array(26)
      let cities = data.payload
      const words = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
      words.forEach((item,index)=>{
        storeCity[index] = {
          key: item,
          list: []
        }
      })
      cities.forEach(item => {
        let pinyin = item.ind.toUpperCase()
        let index = words.findIndex(item => item === pinyin)
        storeCity[index].list.push({
          key: pinyin,
          name: item.brand
        })
      })
      this.setData({
        cities: storeCity
      })
    })
  },
  selectBrand(e) {
    console.log(e)
    const { brand } = e.currentTarget.dataset
    let params = {
      brand
    }
    road.VehicleModelList(params).then(data=>{
      console.log(data)
      let carlist = JSON.stringify(data.payload)
      if(data.code==200){
        wx.navigateTo({
          url: `./child/carlist?carlist=${carlist}`,
        })
      }
    })
  }
});
