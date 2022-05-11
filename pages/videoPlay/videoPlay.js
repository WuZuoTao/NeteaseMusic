// pages/videoPlay/videoPlay.js
import request from '../../utils/request'
const  windowWidth = wx.getWindowInfo().windowWidth
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id:'',
        videoObj:{},
        url: '' , //初始化视频路径
        rightStatus:{}, // 初始化右边图标信息 
        isVideoShow:false , //是否暂停
        currentTime:"00:00",  //初始化播放时间
        duration:"99:99",  // 初始化结束时间
        currentWindth:0 , //初始化进度条长度
        controls:false ,  // 是否显示按钮
        isPause:false // 是否暂停
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let id = options.id
        this.setData({
            id
        })
        this.videoPlayApiFun(id)
        this.videoContext =  wx.createVideoContext('videoContext')
    },
    // 请求api
    videoPlayApiFun(id){
        request('/video/url',{id}).then(res => {
            this.setData({
                url:res.urls[0].url
            })
        })
        request('/video/detail/info',{vid:id}).then(res => {
            this.setData({
                rightStatus:res
            })
        })
        request('/video/detail',{id}).then(res => {
            this.setData({
                videoObj:res.data
            })
        })
    },
    //  监听播放时间
    videoTateFun(e){
        let {currentTime,duration} = e.detail
        let currentWindth = currentTime / duration * Number(windowWidth)
        this.setData({
            currentTime,
            duration,
            currentWindth
        })
    },
    // 控制视频播放还是暂停
    commandVideoFun(){
        let isVideoShow = !this.data.isVideoShow
        let isPause = !this.data.isPause
        if(isVideoShow){
            this.videoContext.pause()
        }else{
            this.videoContext.play()
        }
        this.setData({
            isVideoShow,
            isPause
        })
    },
    // 全屏播放
    magnifyFun(){
        this.videoContext.requestFullScreen({direction:90})
    },
    // 控制按键显示或者隐藏
    isShowControls(){
        this.setData({
            controls:!this.data.controls
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})