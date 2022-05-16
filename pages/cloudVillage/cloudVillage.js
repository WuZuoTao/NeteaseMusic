// pages/cloudVillage/cloudVillage.js
import request from "../../utils/request"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        videoList:'' ,// 初始化视频列表
        videoScrollList:'' ,//初始化导航
        videoListId:'',//当前点击按钮的id
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.viodeApiFun()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
    },
    viodeApiFun(){
        request('/video/category/list').then(res => {
            let id = res.data[0].id
            request("/video/group",{id,offset:100}).then(r =>{
                    r.datas.forEach(item => {
                    if(item.data.praisedCount > 10000){
                        item.data.praisedCount = Math.abs(item.data.praisedCount / 10000).toFixed(1) + '万'
                    }else if(item.data.praisedCount > 100000000){
                        item.data.praisedCount = Math.abs(item.data.praisedCount / 10000).toFixed(1) + '亿'
                    }
                    return item.data.praisedCount = item.data.praisedCount
                })
                this.setData({
                    videoList:r.datas,
                    videoListId:id
                })
            })
            this.setData({
                videoScrollList:res.data
            })
        })
    },
    scrollViewFun(e){
        let id = e.currentTarget.dataset.id
        request("/video/group",{id,offset:100}).then(r =>{
            this.setData({
                videoList:r.datas,
                videoListId:id
            })
        })
    },
    toVideoPlayFun(e){
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
          url: '/pages/videoPlay/videoPlay?id='+id,
        })
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