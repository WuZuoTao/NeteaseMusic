// pages/recentlyPlay/recentlyPlay.js
import request from '../../utils/request'
import pubsub from 'pubsub-js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        playList:[], //初始化播放列表
        index:''  //初始化一个下标
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.recentlyPlayFun()
        pubsub.subscribe('swichType',(m,playData) =>{
            let {playList,index} = this.data
            let { type , nmb} = playData
            switch(nmb){
                case 3:
                    let random = Math.ceil((Math.random() * 100000) % (playList.length - 1))
                    index = random
                    console.log(random)
                    break;
                case 2:
                case 1:
                    if(type === 'onA'){
                        (index === 0) && (index = playList.length)
                        index = index - 1
                    }else{
                        (index === playList.length - 1 ) && (index = -1)
                        index = index + 1
                    }
            }
            this.setData({
                index
            })
            let musicId = playList[index].data.id
            pubsub.publish('musicId',musicId)
        })
    },
    recentlyPlayFun(){
        request('/record/recent/song',{limit:300}).then(res =>{
            this.setData({
                playList:res.data.list
            })
        })
    },
    toPlayMusic(e){
        let {id,index} = e.currentTarget.dataset
        console.log(e)
        wx.navigateTo({
          url: `/pages/playMusic/playMusic?id=`+id,
        })
        this.setData({
            index
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