
import config from './request.config'

export default (url,data={},method="GET") => {
    return new Promise((resolve,reject) =>{
        wx.request({
          url: config.nodeJs + url,
          data,
          method,
          success: res => {
            resolve(res.data)
          },
          fail: err =>{
              reject(err)
          }
        })
    })
}