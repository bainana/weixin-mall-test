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
  if(!loggined){
    wx.removeStorageSync('token')
    return false
  }
  const checkTokenRes = await WXAPI.checkToken(token)
  if (checkTokenRes.code != 0) {
    wx.removeStorageSync('token')
    return false
  }
  return true
}

async function register(page){
  let _this = this;
  wx.login({
    success: (res)=>{
      let code= res.code;
      wx.getUserInfo({
        success: (res)=>{
          let iv = res.ic;
          let encryptedData = res.encryptedData;
          let referrer = '';
          let referrer_storage = wx.getStorageSync('erferrer');
          if (referrer_storage) {
            referrer = referrer_storage
          }
          WXAPI.register_complex({
            code: code,
            encryptedData: encryptedData,
            iv: iv,
            referrer: referrer
          }).then((res) => {
            _this.login(page)
          })
        }
      })
      
    }
  })
}

function login(){
  wx.login({
    success: (res) => {
      WXAPI.login_wx(res.code).then((res) => {
        console.log(res)
        if(res.code == 10000){
          return
        }
        if(res.code !=0){
          wx.showModal({
            title: '无法登陆',
            content: res.msg,
            showCancel: false
          })
          return
        }

        wx.setStorageSync('token', res.data.token)
        wx.setStorageSync('uid', res.daa.uid)
        if(page){
          page.onShow()
        }
      })
    }
  })
}


module.exports = {
  checkHasLogined: checkHasLogined,
  register: register,
  login: login
}