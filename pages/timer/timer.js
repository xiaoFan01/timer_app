var util = require('../../utils/util.js');
const app = getApp();
Page({
  data: {
    //存储计时器
    setInter: '',
    num: 0,
    formatTime1: '00:00:00',
    firstTime: '',
    lastTime: '',
    window: '',
    start: false,
    stop: true,
    save: true,
    name: ''
  },
  onLoad: function() {
    var win = wx.getStorageSync('window')
    this.setData({
      window: win
    })

  },
  first() {
    var that = this;
    var time = util.formatTime(new Date());
    console.log(time);
    wx.showModal({
      title: '提示',
      content: '开弓没有回头箭，您确定开始吗？',
      success(res) {
        if (res.confirm) {
          that.setData({
            firstTime: time
          })
          that.startSetInter()
        }
      }
    })
  },
  startSetInter: function() {
    var that = this;
    //将计时器赋值给setInter
    that.setData({
      start: true,
      stop: false,
      save: true,
    })
    that.data.setInter = setInterval(
      function() {
        var numVal = that.data.num + 1;
        var ftime = that.formatTime1(numVal);
        that.setData({
          num: numVal,
          formatTime1: ftime
        });
        console.log('setInterval==' + that.data.num);
      }, 1000);
  },
  endSetInter: function() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '结束或许是新的开始，你确定结束吗？',
      success(res) {
        if (res.confirm) {
          clearInterval(that.data.setInter)
          var time1 = util.formatTime(new Date());
          console.log(time1);
          that.setData({
            lastTime: time1,
            start: true,
            stop: true,
            save: false,
          })
        }
      }
    })
  },
  onHide: function() {

  },
  onUnload: function() {
    var that = this;
    //清除计时器  即清除setInter
    clearInterval(that.data.setInter)
  },
  // 秒数 --> 时：分：秒
  formatTime1(num) {
    return [
        parseInt(num / 60 / 60), // 时
        parseInt(num / 60 % 60), // 分
        parseInt(num % 60) // 秒
      ]
      .join(":")
      .replace(/\b(\d)\b/g, "0$1");
  },
  reset() {
    var that = this;
    clearInterval(that.data.setInter)
    this.setData({
      num: 0,
      formatTime1: '00:00:00',
      firstTime: '',
      lastTime: '',
      start: false,
      stop: true,
      save: true,
    })
  },
  title(e) {
    this.data.title = e.detail.value;
  },
  save() {
      var ns0 = new Array();
      var that = this;
      var ns = {
        name: that.data.title,
        st: that.data.firstTime,
        et: that.data.lastTime,
        tt: that.formatTime1(that.data.num),
      };
      if(wx.getStorageSync('usernumber')){
      console.log("有id")
      wx.getNetworkType({
        success: function(res) {
          console.log(res.networkType)
          if (res.networkType == "none") {
            wx.showToast({
              title: '无网络连接',
              duration: 1000,
              icon: 'loading'
            })
            if (wx.getStorageSync('notsave')) {
              ns0 = wx.getStorageSync('notsave');
              ns0.push(ns);
              wx.setStorageSync('notsave', ns0)
              console.log("00000" + wx.getStorageSync('notsave'))
            } else {
              ns0.push(ns);
              wx.setStorageSync('notsave', ns0)
            }
          } else {
            wx.request({
              url: app.globalData.url + '/record/save',
              data: {
                userNum: wx.getStorageSync('usernumber'),
                title: ns.name,
                startTime: ns.st,
                endTime: ns.et,
                tatalTime: ns.tt,
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
              method: "POST",
              success: function(res) {
                console.log(res.data)
                if (res.data == 1) {
                  wx.showToast({
                    title: '保存成功',
                    duration: 1000
                  })
                }
              }
            })
          }
        },
      })
      that.reset()
      that.setData({
        name: ""
      })
    }else{
      if(wx.getStorageSync('notsave')){
        ns0 = wx.getStorageSync('notsave')
        ns0.push(ns)
      }else{
        ns0.push(ns)
      }
      wx.setStorageSync('notsave',ns0)
      wx.getNetworkType({
        success: function(res) {
          if(res.networkType=="none"){
            wx.showToast({
              title: '无网络连接',
              icon:'loading'
            })
            that.reset()
            that.setData({
              name:""
            })
          }
          else{
            wx.showModal({
              title: '提示',
              content: '请登录',
              success(res){
                if(res.confirm){
                  wx.redirectTo({
                    url: '/pages/login/login',
                  })
                }
              }
            })
          }
        },
      })
    }
  }
})