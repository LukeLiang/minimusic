// pages/playlist/playlist.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrls:[
    //     {
    //   url:      'http://p1.music.126.net/oeH9rlBAj3UNkhOmfog8Hw==/109951164169407335.jpg',
    // },
    //   {
    //     url: 'http://p1.music.126.net/xhWAaHI-SIYP8ZMzL9NOqg==/109951164167032995.jpg',
    //   },
    //   {
    //     url: 'http://p1.music.126.net/Yo-FjrJTQ9clkDkuUCTtUg==/109951164169441928.jpg',
    //   }
    ],
    playList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options.scene)
      this._getSwiper()
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name:'music',
      data:{
        start: this.data.playList.length,
        count:15,
        $url: 'playlist'
      },
    }).then((res) => {
      this.setData({
        playList:res.result.data
      })
      wx.hideLoading()
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
    this.setData({
      playList:[]
    })
    this._getRefresh()
    this._getSwiper()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._getRefresh()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },


  _getRefresh(){
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name:'music',
      data:{
        start:this.data.playList.length,
        count:15,
        $url: 'playlist'
      }
    }).then((res) => {
      this.setData({
        playList:this.data.playList.concat(res.result.data)
      })
      wx.stopPullDownRefresh() //上拉刷新完就关闭三个按钮
      wx.hideLoading()
    })
  },

  _getSwiper(){
    db.collection('swiper').get().then((res) => {
      console.log(res)
      this.setData({
        imageUrls: res.data
      })
    })
  }

})