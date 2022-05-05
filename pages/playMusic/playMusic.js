// pages/playMusic/playMusic.js
let degTime

Page({
    
    /**
     * 页面的初始数据
     */
    data: {
        isPlay:true,
        deg:'' // 用于记录旋转的度数
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.degFun()
    },
    isPlay(){
        this.setData({
            isPlay:!this.data.isPlay
        })
        this.degFun()
    },
    degFun(){
        if(!this.data.isPlay){
            clearInterval(degTime)
            console.log('我进来了',degTime)
            return
        }
        if(degTime){
            clearInterval(degTime)
        }
        degTime = setInterval(() => {
            let deg = Number(this.data.deg) + 2
            if(deg > 360){
                this.setData({
                    deg:0
                })
            }else{
                this.setData({
                    deg
                })
            }
        }, 100);
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