// pages/videoPlay/videoPlay.js
import request from '../../utils/request'
// 获取屏幕的宽度
const  windowWidth = wx.getWindowInfo().windowWidth
// 计数器
let index = 0
// 单击计时器 控制播放和暂停
let time
// 双击计时器  控制点赞的icon
let lickTime
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id:'', // 视频ID
        videoObj:{}, // 视频对象
        url: '' , //初始化视频路径
        rightStatus:{}, // 初始化右边图标信息 
        isVideoShow:false , //是否暂停
        currentTime:"00:00",  //初始化播放时间
        duration:"99:99",  // 初始化结束时间
        currentWindth:0 , //初始化进度条长度
        controls:false ,  // 是否显示按钮
        isPause:false ,// 是否暂停
        like:false ,// 是否点赞
        likeIconList:[] ,// 创建dom元素
        isComment:false  ,// 是否显示评论
        commentNew:[] ,// 初始化评论信息
        // sortType:1, //设置排序  1:按推荐排序, 2:按热度排序, 3:按时间排序
        before:'',  //  时间排序时需要保存一下time 
        offset:1,  //请求的分页数
        limit:20  // 评论请求个数
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 先保存一下跳转传过来的路径
        let id = options.id
        this.setData({
            id
        })
        // 执行API请求  请求数据
        this.videoPlayApiFun(id)
        // 创建一个video实例
        this.videoContext =  wx.createVideoContext('videoContext')
    },
    // 请求api
    videoPlayApiFun(id){
        // url请求路径
        request('/video/url',{id}).then(res => {
            this.setData({
                url:res.urls[0].url
            })
        })
        // 点赞之类的详情数据
        request('/video/detail/info',{vid:id}).then(res => {
            res.likedCount = this.nubLikeStringFun(res.likedCount)
            res.commentCount = this.nubLikeStringFun(res.commentCount) 
            res.shareCount = this.nubLikeStringFun(res.shareCount) 
            this.setData({
                rightStatus:res
            })
        })
        //  对象详细信息
        request('/video/detail',{id}).then(res => {
            this.setData({
                videoObj:res.data
            })
        })
    },
    //  监听播放时间
    videoTateFun(e){
        // 获取到正在播放时时间 和结束时间
        let {currentTime,duration} = e.detail
        //  形成正比 达到进度条的效果
        let currentWindth = currentTime / duration * Number(windowWidth)
        this.setData({
            currentTime,
            duration,
            currentWindth
        })
    },
    // 控制视频播放还是暂停
    commandVideoFun(e){
        // 是否暂停
        let isVideoShow = !this.data.isVideoShow
        // 显示播放图标
        let isPause = !this.data.isPause
        //  获取手点击的位子
        let top = Math.ceil(e.detail.y) * 2 - 120
        let left = Math.ceil(e.detail.x) * 2 - 60
        let likeIconList = this.data.likeIconList
        // 判断是否打开了评论，打开了点击视频就关闭评论
        if(this.data.isComment){
            this.setData({
                isComment:!this.data.isComment
            })
            return
        }
        index += 1
        // 清空上一个定时器
        clearTimeout(time)
        // 创建一个定时器，延迟判断是否是单击屏幕
        time = setTimeout(() => {
            if(index == 1 && !this.data.isComment) {
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
            //  执行了之后吧计数器清零
            index = 0
        },300)
        // 判断双击效果
        if(index > 1 && !this.data.isComment){
            // 如果是第一次责发送一个api请求给后端，只执行一次
            if(!this.data.like){
                request('/resource/like',{type:5,id:this.data.id,t:1}).then(res => {
                    if(res.code === 200){
                        this.setData({
                            like:true
                        })
                    }
                })
            }
            // 创建一个对象  点赞icone效果  并加入数组中达到操作DOM的效果 ====   手动给元素中加入DOM然后删除
            likeIconList.push({top,left})
            // 只让元素显示一秒钟就删除
            setTimeout(() => {
                likeIconList.shift()
                this.setData({
                    likeIconList
                })
            },1000)
            // 清空双击定时器
            clearTimeout(lickTime)
            // 延迟300毫秒后让计数器清零
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
    // 评论的显示与隐藏
    isCommentFun(){
        let isComment = !this.data.isComment
        // 调用评论请求的api
        this.commentNewFun()
        this.setData({
            isComment
        })
    },
    bindscrolltolowerFun(){
        this.commentNewFun()
    },
    // 评论请求的api
    commentNewFun(){
        let {commentNew,rightStatus,id,offset,before,limit} = this.data
        limit = commentNew.length + limit  > rightStatus.commentCount ? rightStatus.commentCount  - commentNew.length  : limit
        console.log(limit)
       if(commentNew.length < rightStatus.commentCount){
        request('/comment/video',{id,limit,offset,before}).then(res => {
            if(commentNew.length > 5000){
                before = res.comments[res.comments.length - 1].time
            }
            commentNew = commentNew.concat(res.comments)
            this.setData({
                commentNew,
                offset:Number(offset) + 1
            })
        })
       }
    },
    // 数据转换API
    nubLikeStringFun(type){
        if(type > 10000){
            type = Math.abs(type / 10000).toFixed(1) + '万'
        }else if(type > 100000000){{
            type = Math.floor(type / 100000000) + '亿'
        }}
        return type
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