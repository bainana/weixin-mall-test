//index.js
const WXAPI = require('apifm-wxapi');
const CONFIG = require('../../config.js');
const TOOLS = require('../../utils/tool.js')
//获取应用实例
const app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.getBanner();//获取banner
    this.getNotice();//获取通告
    this.getCategory();//获取商品分类
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }


  },
onShow: function(){
  console.log('onshow');
  // 获取购物车数据，显示TabBarBadge
  TOOLS.showTabBarBadge();
},

  getUserInfo(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  /**banner*/
  async getBanner() {
    WXAPI.banners().then(res => {
      if (res.code == 0) {
        this.setData({
          banners: res.data
        })
      }
    })
  },

/*** 获取公告 ***/
  getNotice() {
    WXAPI.noticeList({ pageSize: 5 }).then((res) => {
      if (res.code == 0) {
        this.setData({
          noticeList: res.data
        });
      }
    })
  },

/* banner跳转**/
  tapBanner: function(e){
    if(e.currentTarget.dataset.id !== 0){
      wx.navigateTo({
        url: '/pages/goods-detail/index?id=' + e.currentTarget.dataset.id
      })
    }
  },

  /**获取分类*/
  async getCategory(){
    const res = await WXAPI.goodsCategory()
    let categories = [];
    if (res.code == 0) {
      const _categories = res.data.filter(ele => {
        return ele.level == 1
      })
      categories = categories.concat(_categories)
    }
    this.setData({
      categories: categories,
      activeCategoryId: 0,
      curPage: 1
    });
    this.getGoodsList(0);
  },
  getGoodsList(){

  },

  /* 点击分类**/
  tapClick(e){
    console.log(e.currentTarget.id)
    wx.switchTab({
      url: '/pages/goods/index?id=' + e.currentTarget.id
    })
  }
})
