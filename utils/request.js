
import config from './request.config'

export default (url,data={},method="GET") => {
    return new Promise((resolve,reject) =>{
        wx.request({
          url: config.dingding + url,
          data,
          method,
          header:{
            cookie:wx.getStorageSync('cookies') ? wx.getStorageSync('cookies').filter(item => item.indexOf('MUSIC_U') !== -1)[0]:''
        },
          success: res => {
            let cokkis = wx.getStorageSync('cookies')
            if(!cokkis && res.cookies.length > 10){
                wx.setStorageSync('cookies', res.cookies)
            }
            resolve(res.data)
          },
          fail: err =>{
              reject(err)
          }
        })
    })
}