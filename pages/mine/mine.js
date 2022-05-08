// pages/mine/mine.js
import request from '../../utils/request'
Page({
    /**
     * 页面的初始数据
     */
    data: {
      user:'' , // 初始化个人数据
      loveMusic: {}, //初始化喜欢音乐数据
      musicList:{}  // 初始化创建歌单列表
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if(wx.getStorageSync('user')){
            this.getUserFun()
        }
    },

    // 读取storage里的用户信息
    getUserFun(){
      let user = wx.getStorageSync('user')
      let uid = user.userId
      request('/user/detail',{uid}).then(res =>{
        this.setData({
          user:res
        })
      })
      request('/user/playlist',{uid}).then(res =>{
         let loveMusic = res.playlist.splice(0,1)[0]
         let musicList = res.playlist.splice(0)
         this.setData({
             loveMusic,
             musicList
         })
      })
    },
    // 跳转到登录界面
    toLoginFun(){
       if(!this.data.user){
        wx.redirectTo({
          url: '/pages/login/login',
        })
        return
       }

    },
    toRecentlyPlayFun(){
        wx.redirectTo({
          url: '/pages/recentlyPlay/recentlyPlay',
        })
    },
    // 清除Storage
    deleteStorage(){
        wx.removeStorageSync('cookies')
        wx.removeStorageSync('user')
        wx.removeStorageSync('cookie')
        wx.removeStorageSync('token')
        wx.removeStorageSync('isCookies')
        wx.redirectTo({
            url: '/pages/login/login',
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