const WXAPI = require('apifm-wxapi');

async function checkSession(){
  return new Promise((resolve,reject) => {
    wx.checkSession({
      success(){
        return resolve(true)
      },
      fail(){
        return resolve(false)
      }
    })
  })
}

//检测登录状态
async function checkHasLogined(){
  const token = wx.getStorageSync('token')
  if(!token){
    return false
  }
  const loggined = await checkSession()
}