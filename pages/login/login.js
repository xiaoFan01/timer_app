const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    window:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var win = wx.getStorageSync('window')
    this.setData({
      window: win
    })
    wx.getNetworkType({
      success: function (res) {
        console.log(res.networkType)
        if (res.networkType == "none"){
          wx.showModal({
            title: '提示',
            content: '暂无网络连接，是否进入离线模式？',
            success(res){
              if(res.confirm){
                wx.setStorage({
                  key: 'usernumber',
                  data: null,
                })
                wx.switchTab({
                  url: '/pages/timer/timer',
                })
              }
            }
          })
        }
      }
    })
  },
  number(e){
    this.data.number = e.detail.value;
  },
  password(e){
    this.data.password = e.detail.value;
  },
  commit(){
    var n = this.data.number;
    var m = this.data.password;
    wx.request({
      url: app.globalData.url + '/app/login',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data:{
        userNum:n,
        passwd:m
      },
      success: function (res) {
        console.log(res.data)
        if(res.data==1){
          wx.setStorageSync('usernumber', n)
          wx.switchTab({
            url: '/pages/timer/timer'
          })
        }
        else{
          wx.showToast({
            title: '登陆失败',
            icon:'loading'
          })
        }
      }
    })
  }
})