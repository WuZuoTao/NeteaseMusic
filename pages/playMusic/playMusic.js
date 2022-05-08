// pages/playMusic/playMusic.js
import request from '../../utils/request'
import moment from 'moment'
import pubsub from 'pubsub-js'
// 获取全局实例对象
const appGlobalData = getApp()
Page({
    
    /**
     * 页面的初始数据
     */
    data: {
        isPlay:true,  // 初始化播放转态
        isOptionNmb:1 ,// 用于记录用户选择播放的条件  1== 顺序播放 2 == 单曲循环  3 == 随机播放
        startTime:'00:00' ,//初始化开始时间
        endTime:'00:00',  // 初始化结束时间
        musicId:'', //当前播放歌单ID
        musicUrl:'', // 初始化音乐播放地址
        musicObj:{}, //初始化当前播放歌单对象
        currenWidth:0 ,//初始化进度条长度
        isLyric:false,  //是否显示歌词
        lyric:[] , // 歌词对象
        scrollTop:0, //滚动距离
        lyricIndex:1 ,//当前的下标
    },
    scrollTopFun(){},
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 初始化一个音乐的实例
        this.backgroundAudioManager = wx.getBackgroundAudioManager()
        let isOptionNmb 
        if(!wx.getStorageSync('isOptionNmb')){
            isOptionNmb = this.data.isOptionNmb
        }else{
            isOptionNmb = wx.getStorageSync('isOptionNmb')
        }
        this.setData({
            musicId:Number(options.id),
            isOptionNmb
        })
        this.songDetailFun()
        this.backgroundAudioManager.onTimeUpdate(() => {
           this.onTimeUpdateFun()
        })
        this.backgroundAudioManager.onPause(() => {
            this.isPlay(false)
        })
        this.backgroundAudioManager.onPlay(() =>{
            this.isPlay(true)
        })
        this.backgroundAudioManager.onEnded(() =>{
            let isOptionNmb = Number(this.data.isOptionNmb)
            switch(isOptionNmb){
                case 1:
                    console.log('执行了1')
                    this.pubsubSwitchFun({type:'next',nmb:isOptionNmb})
                    break;
                case 2:
                    console.log('执行了2')
                    this.musicControlFun()
                    break;
                case 3:
                    console.log('执行了3')
                    this.pubsubSwitchFun({type:'next',num:isOptionNmb})
                    break;
            }
        })
    },
    // 监听音乐播放进度时间
    onTimeUpdateFun(){
        let {lyric,lyricIndex,scrollTop} = this.data
        let currentTime = this.backgroundAudioManager.currentTime * 1000
        let startTime = moment(currentTime).format('mm:ss')
        let currenWidth = this.backgroundAudioManager.currentTime / (this.data.musicObj.dt / 1000) * 534
        if(lyric[lyricIndex].lyricTime < currentTime  && lyricIndex < lyric.length){
            // scrollTop = Number(this.data.scrollTop) + 61.6
            scrollTop = Number(scrollTop) + 61.6
            lyricIndex  =  lyricIndex + 1
        }
        this.setData({
            startTime,
            currenWidth,
            scrollTop,
            lyricIndex
        })
    },
    // 控制音乐播放按钮
    isPlay(isPlay){
        this.setData({
            isPlay
        })
        appGlobalData.globalData.appIsPlay = isPlay
        this.musicControlFun()
    },
    isPlayFun(){
        let isPlay = !this.data.isPlay
        this.isPlay(isPlay)
    },
    // 控制音乐播放停止功能
    musicControlFun(){
        let isPlay = this.data.isPlay
        if(isPlay){
            // 创建音乐播放对象
            let { musicId } = this.data
        // 判断当前音乐是否在播放
            this.backgroundAudioManager.title = this.data.musicObj.name
            this.backgroundAudioManager.src = this.data.musicUrl
            appGlobalData.globalData.appMusicId = musicId
        }else{
            this.backgroundAudioManager.pause()
        }
    },
      // 获取歌曲详情API
      songDetailFun(){
          let id = Number(this.data.musicId)
        request('/song/detail',{ids:id}).then(res =>{
            let musicObj = res.songs[0]
            let endTime = moment(res.songs[0].dt).format('mm:ss')
            this.setData({
                musicObj,
                endTime
            })
            wx.setNavigationBarTitle({
                title:this.data.musicObj.name
            })
            request('/song/url',{id}).then(res =>{
                this.setData({
                    musicUrl:res.data[0].url,
                    isPlay:true
                })
                this.musicControlFun()
            })
            request('/lyric',{id}).then(res =>{
                let lyric = res.lrc.lyric
                let lyricArr = []
                // 正则匹配
                let ces = lyric.match(/(\[\d+:\d+.\d+\]) ?([\u4e00-\u9fa5]+ ? ?:? ?[\u4e00-\u9fa5]+)?/g)
                for(let i = 0 ; i < ces.length ; i++){
                    let lyricDate = String(ces[i].match(/(\d+:\d+.\d+)/ig))
                    let lyricText = String(ces[i].match(/[\u4e00-\u9fa5]+ ? ?:? ?[\u4e00-\u9fa5]+/ig))
                    let lyricTime = lyricDate.split(/\D+/g)
                    lyricTime = (Number(lyricTime[0]) * 60  + Number(lyricTime[1])) * 1000 + Number(lyricTime[2])
                    //  转换为字符串存到数组中
                    if(lyricText !== 'null'){
                        lyricArr.push({lyricText,lyricDate,lyricTime})
                    }
                }
                // console.log('ces',ces)
                // console.log('lyricDate',lyricDate)
                // console.log('lyricText',lyricText)
                // console.log(lyricArr)
                this.setData({
                    lyric:lyricArr
                })
            })
        })
    },
    // 控制循环事件
    isOptionNmbFun(){
        let {isOptionNmb} = this.data
        if(isOptionNmb > 2){
            isOptionNmb = 1
        }else{
            isOptionNmb = Number(isOptionNmb) + 1
        }
        this.setData({
            isOptionNmb
        })
        wx.setStorageSync('isOptionNmb', isOptionNmb)
    },
    // 切换歌曲的回调
    switchFun(e){
        let type = e.currentTarget.id
        let nmb = this.data.isOptionNmb
        this.pubsubSwitchFun({type,nmb})
    },

    pubsubSwitchFun(playData){
        // 关闭当前音乐
        this.backgroundAudioManager.stop()
        pubsub.unsubscribe('musicId')
        // 发布消息给父级页面
        pubsub.subscribe('musicId',(m,musicId) =>{
            this.setData({
                musicId
            })
            this.songDetailFun()
        })
        pubsub.publish('swichType',playData)
    },

    // 是否显示歌词函数
    isLyricFun(){
    this.setData({
        isLyric:!this.data.isLyric
    })
    }
})