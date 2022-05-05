// pages/password/password.js
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone:'',
        password:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },
    inputFun(e){
        console.log(e)
        if(e.currentTarget.id === 'password'){
            this.setData({
                password:e.detail.value
            })
        }
        if(e.currentTarget.id === 'phone'){
            this.setData({
                phone:e.detail.value
            })
        }
    },
    loginBtn(){
        let {phone,password} = this.data
        request('/login/cellphone',{phone,password}).then(res =>{
            console.log(res)
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