// pages/loginphone/loginphone.js
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone:'',  //  手机号数据
        widthHeight:'',  // 手机屏幕高度初始化数据
        countriesList:[], // 国家和地区数据
        conutriesText:[], // 地区建议话数据
        code:86,  // 初始化code编码
        codeIsShow:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getHeightFun()
    },
    // code编码显示或者隐藏
    iscodeShow(){
        this.setData({
            codeIsShow:!this.data.codeIsShow
        })
    },
    // 获取code编码
    itemCodeFun(e){
        this.setData({
            code:Number(e.currentTarget.dataset.code)
        })
        this.iscodeShow()
    },
    // 获取屏幕的高度
    getHeightFun(){
        const windowInfo = wx.getWindowInfo()
        let widthHeight = windowInfo.windowHeight
        widthHeight = widthHeight - 44
        this.setData({
            widthHeight: widthHeight*2
        })
        request('/countries/code/list').then(res => {
            let countriesList = res.data
            let conutriesText = []
            countriesList.forEach(item => {
                conutriesText.push(item.label.slice(0,1)) 
            })
            this.setData({
                countriesList,
                conutriesText
            })
        })
    },
    inputPhone(e){
        this.setData({
            phone:e.detail.value
        })
    },
    toauthcodeFun(){
        let { phone,code } = this.data
        if(this.data.phone){
            wx.navigateTo({
                url: `/pages/authcode/authcode?phone=${phone}&code=${code}`,
                success: res =>{
                  request('/captcha/sent',
                  {phone,countrycode:code}).then(resolve =>{
                      console.log(resolve)  
                  })
                }
              })
        }
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