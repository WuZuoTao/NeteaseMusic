import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList:[],
    personalizedList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.swiperApiFun()
    this.personalizedFun()
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
        personalizedList
      })
    }))
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