// pages/blog-edit/blog-edit.js
let MAX_WORDD_NUM = 120  //最多输入文字个数
let MAX_PHOTO_NUM = 9    //最多可以选择图片的个数
let content = ''         //发布的内容
let userInfo = []        //用户登录的个人信息
const db = wx.cloud.database()  //微信数据库初始化操作
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum:0,
    footerBottom:0,
    images:[],
    isHideJiahao:false
  },

  onInput(event){
    let wordsNum = event.detail.value.length
    if (wordsNum >= MAX_WORDD_NUM){
      wordsNum = `最多只能输入${MAX_WORDD_NUM}个字符`
      this.setData({
        wordsNum
      })
    }
    this.setData({
      wordsNum
    })
    content = event.detail.value
  },

  onFocus(event){
    //这里面可以设置键盘的高度(height就是键盘的高度)
    this.setData({
      footerBottom:event.detail.height
    })
  },

  onBlur(event){
    this.setData({
      footerBottom: 0
    })
  },

  onChooseImg(){
    wx.chooseImage({
      //还能再选几张图片
      count:MAX_PHOTO_NUM - this.data.images.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // console.log(res)
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })
        let max = MAX_PHOTO_NUM - this.data.images.length
        this.setData({
          isHideJiahao:max <= 0 ? true : false
        })
      },
    })
  },

  onDelImg(event){
    this.data.images.splice(event.target.dataset.index,1)
    this.setData({
      images: this.data.images
    })
    if(this.data.images.length < MAX_PHOTO_NUM){
      this.setData({
        isHideJiahao:false
      })
    }
  },

  onPreviewImg(event){
    wx.previewImage({
      urls: this.data.images,
      //当前我要预览这张图片要预览的地址
      current:event.target.dataset.imgSrc
    })
  },

  onSend(){
    if(content.trim() === ''){
      wx.showModal({
        title: '请输入内容',
        content: '',
      })
      return 
    }

    wx.showLoading({
      title: '发布中...',
      mask:true,
    })

    let promiseArr = []
    let fileIds = []

    //数据 => 云存储 => 云数据库
    //数据库:内容  图片(fileID) 用户(openID,小程序中用户的唯一标识)、昵称、头像
    //图片 -> 云存储
    for(let i = 0, len = this.data.images.length; i < len; i++){
      let p = new Promise((resolve,reject) => {
        let item = this.data.images[i]
        // let suffix = item.split('.')[3]
        let suffix = /\.\w+$/.exec(item)[0]   //取出文件的扩展名 相当于 .png
        wx.cloud.uploadFile({  //每次只能上传一张,所以用遍历的方式循环上传
          cloudPath: 'blog/' + Date.now() + '-' + Math.random * 1000000 + suffix,
          filePath: item, // 文件路径
          success: (res) => {
            console.log(res)
            fileIds = fileIds.concat(res.fileID)  //fileID:图片的唯一标识
            resolve()
          },
          fail: (err) => {
            console.log(err)
            reject()
          }
        })
      })
      //每一个Promise(上传任务)执行完成后 就存入这个数组中
      promiseArr.push(p)
    }
    //上传到云数据库
    //promise.all(promiseArr) 表示  promiseArr中所有的任务都完成以后 再执行then中的函数
    Promise.all(promiseArr).then((res) => {
      db.collection('blog').add({
        data:{
          ...userInfo,   //userInfo是一个对象, ...表示userInfo中的每一个属性
          content,
          img:fileIds,
          createTime:db.serverDate()    //服务端的时间
        }
      }).then((res) => {
        wx.hideLoading()
        wx.showToast({
          title: '发布成功',
          icon:'success'
        })
        //返回blog页面,并且刷新
        wx.navigateBack()
        const pages = getCurrentPages()
        //取到上一个页面
        const prevPage = pages[pages.length - 2]
        prevPage.onPullDownRefresh()

      }).catch((err) => {
        wx.hideLoading()
        wx.showToast({
          title: '发布失败',
        })
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    userInfo = options
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

  }
})