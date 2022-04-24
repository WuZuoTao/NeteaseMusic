// pages/login/login.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isConsent:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
    },
    loginphoneFun(){
        if(!this.data.isConsent){
            wx.showToast({
              title: '请勾选同意服务',
              icon:'none'
            })
            setTimeout(() => {
                wx.hideToast()
            }, 3000);
          return
        }
        wx.navigateTo({
          url: '/pages/loginphone/loginphone'
        })
    },
    // 是否同意按钮
    isConsentFun(){
        this.setData({
            isConsent:!this.data.isConsent
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