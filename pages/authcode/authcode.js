// pages/authcode/authcode.js
import request from '../../utils/request'
let time
Page({

    /**
     * 页面的初始数据
     */
    data: {
        code:'',  //验证码
        phone:'',   // 手机号
        phones:'',
        numberTime: 59  //初始化一个倒计时
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            phones:options.phone
        })
        this.phoneStringFun(options.phone)
        this.codeTimeFun()
        
    },
    // 掩饰电话号码
    phoneStringFun(phone){
        phone = phone.split('')
        for(let i = 3 ; i < 7 ; i++){
            phone.splice(i,1,'*')
        }
        phone = phone.join('')
        this.setData({
            phone:phone
        })
    },
    // 创建一个定时器
    codeTimeFun(){
        let { numberTime } = this.data
        time = setInterval(() =>{
            if(numberTime == 0){
                clearInterval(time)
                return
            }
            this.setData({
                numberTime: numberTime - 1
            })
        },1000)
    },
    // 重新发送按钮
    resendFun(){
        request('/captcha/sent',{phone:Number(this.data.phones)}).then(res =>{
            if(Number(res.data) === 200){
                this.data.numberTime = 59
                this.codeTimeFun()
            }
        })
    },
    // 验证码验证
    inputCodeFun(e){
        let code = e.detail.value
        this.setData({
            code:e.detail.value
        })
        if(Number(code) > 1000){
            request('/captcha/verify',{phone:Number(this.data.phones),captcha:code}).then(res =>{
               if(res.code !== 200){
                   wx.showToast({
                     title: res.message,
                     icon:'error'
                   })
                   setTimeout(() => {
                       wx.hideToast()
                   }, 1000);
               }else{
                request('/login/cellphone',{phone:Number(this.data.phones),captcha:code}).then(resolve =>{
                    console.log(resolve)
                    wx.setStorageSync('user', resolve)
                    wx.switchTab({
                      url: '/pages/mine/mine',
                    })
                })
               }
            })
        }

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