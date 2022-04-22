import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList:[], // 轮播图数据
    personalizedList:[], // 推荐歌单数据
    radarList:[], // 推荐雷达数据
    rendomList:[], // 查找好听的音乐数据
    topList:[] // 排行榜数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.swiperApiFun()
    this.personalizedFun()
    this.rendomFun()
    this.topListFun()
  },
  
  // 轮播图页面请求API
  swiperApiFun(){
    request('/banner',{type:2}).then(res =>{
      this.setData({
        swiperList:res.banners
      })
    })
  },
  // 推荐歌单API
  personalizedFun(){
    request('/personalized',{limit:10}).then((res =>{
      let personalizedList = res.result
      personalizedList.playCount =  personalizedList.forEach(item =>{
        if(item.playCount > 100000){
          return item.playCount = Math.floor(item.playCount / 10000) + '万'
        }else if(item.playCount > 100000000){
          return item.playCount = Math.floor(item.playCount / 100000000) + '亿'
        }
      })
      this.setData({
        personalizedList:personalizedList.splice(0,5),
        radarList:personalizedList.splice(0,5)
      })
    }))
  },
// 随机列表API
  rendomFun(){
    request('/personalized/newsong',{limit:20}).then(res =>{
      let rendomList = []
      console.log(res)
      let num = 0
      for(let i = 0 ; i < 4 ; i++){
        let list = []
        for(let j = 0 ; j < 3 ; j++){
          list.push(res.result[num])
          num++
        }
        rendomList.push(list)
      }
      this.setData({
        rendomList
      })
    })
  },
  // 排行榜API
  topListFun(){
    request('/toplist/artist').then(res =>{
      console.log(res)
    //   this.setData({
    //     topList:res.list.splice(0,4)
    //   })
    //  console.log(this.data.topList) 
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})