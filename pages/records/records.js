const app = getApp();
Page({

  /**
   * 页面的初始数据 
   */
  data:{
    moment: [],
    total:{},
    page: 0,
    totalPage: 0,
    num: wx.getStorageSync("usernumber"),
    notsave: wx.getStorageSync("notsave")
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      notsave: wx.getStorageSync("notsave"),
      num: wx.getStorageSync('usernumber'),
      page: 0
    })
    wx.request({
      url: app.globalData.url + '/record/' + this.data.num,
      header:{
        'content-type': 'application/json' 
      },
      success(res){
        that.setData({
          total:res.data
        })
      }
    })
    wx.request({
      url: app.globalData.url + '/record/findByNum/' + this.data.num + '/' + this.data.page,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        console.log(that.data.notsave)
        that.setData({
          moment: res.data,
        })
      }
    })
    wx.request({
      url: app.globalData.url + '/record/getTotalPage/' + this.data.num,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          totalPage: res.data,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this;
    that.onLoad()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.page < this.data.totalPage - 1) {
      var that=this;
      // 显示加载图标
      wx.showLoading({
        title: '玩命加载中',
        duration: 1000
      })
      // 页数+1
      var moment0 = new Array();
      moment0 = that.data.moment;
      this.data.page = this.data.page + 1;
      console.log("0000000000000000--" + this.data.page)
      wx.request({
        url: app.globalData.url + '/record/findByNum/' + this.data.num + '/' + this.data.page,
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          console.log(res.data[0])
          // 回调函数
          moment0 = moment0.concat(res.data)
          console.log(moment0)
          // 设置数据
          that.setData({
            moment: moment0
          })
          // 隐藏加载框
          wx.hideLoading();
        }
      })
    }
  },
  delet() {
    wx.removeStorageSync('notsave');
    this.setData({
      notsave: null
    })
  },
  tosave() {
    var that = this;
    wx.getNetworkType({
      success: function(res) {
        console.log(res.networkType)
        if (res.networkType == "none") {
          wx.showToast({
            title: '无网络连接',
            duration: 1000,
            icon: 'loading'
          })
        } else {
          var ns = wx.getStorageSync('notsave')
          for (var i = 0; i < ns.length; i++) {
            wx.request({
              url: app.globalData.url + '/record/save',
              data: {
                userNum: wx.getStorageSync('usernumber'),
                title: ns[i].name,
                startTime: ns[i].st,
                endTime: ns[i].et,
                tatalTime: ns[i].tt,
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
              method: "POST",
              success: function(res) {
                //console.log(res.data)
                // if (res.data == 1) {

                // }
              }
            })
          }
          that.delet()
          that.onLoad()
          wx.showToast({
            title: '保存成功',
            duration: 1000
          })
        }
      },
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})