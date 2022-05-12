// pages/videoPlay/videoPlay.js
import request from '../../utils/request'
const  windowWidth = wx.getWindowInfo().windowWidth
let index = 0
let time
let lickTime
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
        isPause:false ,// 是否暂停
        like:false ,// 是否点赞
        likeIconList:[] // 创建dom元素
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
            let likedCount = res.likedCount
            if(likedCount > 10000){
                likedCount = Math.abs(likedCount / 10000).toFixed(1) + '万'
            }else if(likedCount > 100000000){{
                likedCount = Math.floor(likedCount / 100000000) + '亿'
            }}
            res.likedCount = likedCount
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
    commandVideoFun(e){
        let isVideoShow = !this.data.isVideoShow
        let isPause = !this.data.isPause
        let top = Math.ceil(e.detail.y) * 2 - 120
        let left = Math.ceil(e.detail.x) * 2 - 60
        console.log(top, left)
        let likeIconList = this.data.likeIconList
        index += 1
        clearTimeout(time)
        time = setTimeout(() => {
            if(index == 1) {
                if(isVideoShow){
                    this.videoContext.pause()
                }else{
                    this.videoContext.play()
                }
                this.setData({
                    isVideoShow,
                    isPause
                })
            }
            index = 0
        },300)
        if(index > 1){
            if(!this.data.like){
                request('/resource/like',{type:5,id:this.data.id,t:1}).then(res => {
                    if(res.code === 200){
                        this.setData({
                            like:true
                        })
                    }
                })
            }
            likeIconList.push({top,left})
            console.log(likeIconList)
            setTimeout(() => {
                likeIconList.shift()
                this.setData({
                    likeIconList
                })
            },1000)
            clearTimeout(lickTime)
            lickTime = setTimeout(() => {
                index = 0
            },300)
            this.setData({
                likeIconList
            })
        }
        request('/playlist/mylike').then(res =>{
            // console.log(res)
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
    // 点赞与取消点赞
    noLickFun(){
        let like = !this.data.like
        request('/resource/like',{type:5,id:this.data.id,t:Number(like)}).then(res => {
            console.log(res)
        })
        this.setData({
            like
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