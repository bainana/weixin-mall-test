// pages/my/index.js
const app = getApp();
const CONFIG = require('../../config.js');
const WXAPI = require('apifm-wxapi');
const AUTH = require('../../utils/auth.js');
const TOOLS = require('../../utils/tool.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxlogin: true,
    balance: 0.00,
    freeze: 0,
    score: 0,
    score_sign_continous: 0,
    rechargeOpen: false//是否开启充值
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let rechargeOpen = wx.getStorageSync('RECHARGE_OPEN');
    if(rechargeOpen && rechargeOpen =='1'){
      rechargeOpen = true;
      
    }else{
      rechargeOpen = false;
    }

    this.setData({
      rechargeOpen: rechargeOpen
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
    this.setData({
      version: CONFIG.version,
      vipLevel: app.globalData.vipLevel
    })

    AUTH.checkHasLogined().then(isLogined => {
      this.setData({
        wxlogin: isLogined
      })
      if(isLogined){
        this.getUserApiInfo();
        this.getUserAmount();
      }
    })
    TOOLS.showTabBarBadge();
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

  },

  getUserApiInfo: function(){
    WXAPI.userDetail(wx.getStorageSync('token')).then(function(res){
      if(res.code ==0){
        let data = {}
        data.apiUserInfoMap = res.data
        if(res.data.base.mobile){
          data.userMobile = res.data.base.mobile
        }
        this.setData(data);
      }
    })
  },
  getUserAmount: function(){
    WXAPI.UserAmount(wx.getStorageSync('token')).then((res) => {
      if(res.code == 0){
        this.setData({
          balance: res.data.balance.toFixed(2),
          freeze: res.data.freeze.toFixed(2),
          score: res.data.score
        })
      }
    })
  },

  aboutUs: function(){
    wx.showModal({
      title: '关于我们',
      content: '本系统基于开源小程序商城系统',
      showCancel: false
    })
  },
  goLogin: function(){
    console.log('授权登录')
    this.setData({
      wxlogin: false
    })
  },
  cancelLogin: function(){
    console.log('cancel')
    this.setData({
      wxlogin: true
    })
  },
  processLogin(e){
    if(!e.detail.userInfo){
        wx.showToast({
          title: '已取消',
          icon: true
        })
        return
    }
    AUTH.register(this)
  }
})