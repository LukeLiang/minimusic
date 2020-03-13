// pages/blog/blog.js
let keyWords = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modelShow:false,
    blogList:[]
  },
  //发布功能
  onPublish(){
    wx.getSetting({
      success:(res) => {
        if (res.authSetting['scope.userInfo']){
          wx.getUserInfo({
            success:(res) => {
              this.onSuccess({
                detail:res.userInfo
              })
            }
          })
        }else{
          this.setData({
            modelShow: true
          })
        }
      }
    })
  },

  onSuccess(event){
    const detail = event.detail
    wx.navigateTo({
      url: `../blog-edit/blog-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
    })
  },

  onFail(){
    wx.showModal({
      title: '请先登录...',
      content: '',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadBlogList()
  },

  _loadBlogList(start = 0){
    wx.showLoading({
      title: '拼命加载中...',
    })
    // console.log(keyWords)
    wx.cloud.callFunction({
      name:'blog',
      data:{
        keyWords,
        start,
        count: 10,
        $url:'list',
      }
    }).then((res) => {
      this.setData({
        blogList:this.data.blogList.concat(res.result)
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
  },

  goComment(event){
    wx.navigateTo({
      url: '../../pages/blog-comment/blog-comment?blogId=' + event.target.dataset.blogid,
    })
  },

  onSearch(event){
    this.setData({
      blogList:[]
    })
    keyWords = event.detail.keyWords
    this._loadBlogList(0)
  },

  onInp(event){
    let inp = event.detail.keyWords
    if (inp.trim() == ''){
      this.setData({
        blogList:[]
      })
      keyWords = ''
      this._loadBlogList(0)
    }
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
      blogList:[]
    })
    this._loadBlogList(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._loadBlogList(this.data.blogList.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
      console.log(event)
      const blogObj = event.target.dataset.blog
      return {
          title: blogObj.content,
          //path: 用户点击跳转到的页面
          path: `/pages/blog-comment/blog-comment?blogId=${blogObj._id}`
      }
  }
})