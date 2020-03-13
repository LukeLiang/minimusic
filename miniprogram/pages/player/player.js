// pages/player/player.js
let musiclist = []
//当前正在播放的音乐
let nowPlayingIndex = 0
const bgMusic = wx.getBackgroundAudioManager()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl:'',
    isPlaying:false,
    isLyricShow:false,
    lyric:'',
    isSame:false  //是否是同一首歌
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    nowPlayingIndex = options.index
    musiclist = wx.getStorageSync('musiclist')
    this._loadMusicDetail(options.muiscId)
  },

  _loadMusicDetail(musicId){
    if (musicId == app.getPlayingMusicId()){
      this.setData({
        isSame:true
      })
    }else{
      this.setData({
        isSame: false
      })
    }
    if (!this.data.isSame){
      //切换音乐的时候  先停止播放上一首音乐
      bgMusic.stop()
    }
    let music = musiclist[nowPlayingIndex]
    console.log(music)
    wx.setNavigationBarTitle({
      title: music.name,
    })

    this.setData({
      picUrl:music.al.picUrl,
      isPlaying:false
    })
    //是从app.js中获取全局的信息
    app.setPlayingMusicId(musicId)

    wx.cloud.callFunction({
      name:'music',
      data:{
        musicId,
        $url:'musicUrl'
      }
    }).then((res) => {
      console.log(res)
      if(res.result.data[0].url == null){
        wx.showToast({
          title: '无权限播放',
          icon:'none'
        })
        return 
      }
      if(!this.data.isSame){
        bgMusic.src = res.result.data[0].url
        bgMusic.title = music.name
      }
    })

    //保存播放历史
    this.savePlayHistory()

    this.setData({
      isPlaying:true
    })
    
    //加载歌词
    wx.cloud.callFunction({
      name:"music",
      data:{
        musicId,
        $url:'lyric'
      }
    }).then((res) => {
      let lyrics = '暂无歌词'
      const lrc = res.result.lrc
      if (lrc){
        lyrics = lrc.lyric
      }
      this.setData({
        lyric : lyrics
      })
    })
  },

  toTogglePlay(){
    if(this.data.isPlaying){
      bgMusic.pause()
    }else{
      bgMusic.play()
    }
    this.setData({
      isPlaying:!this.data.isPlaying
    })
  },

  onPrev(){
    nowPlayingIndex--
    if (nowPlayingIndex < 0){
      nowPlayingIndex = musiclist .length - 1
    }
    this._loadMusicDetail(musiclist[nowPlayingIndex].id) 
  },

  onNext(){
    nowPlayingIndex++
    if (nowPlayingIndex === musiclist.length - 1){
      nowPlayingIndex = 0
    }
    this._loadMusicDetail(musiclist[nowPlayingIndex].id)
  },

  onLyricShow(){
    this.setData({
      isLyricShow : !this.data.isLyricShow
    })
  },

  update(event){
    this.selectComponent('.lyric').update(event.detail.currentTime)
  },

  musicPlay(){
    this.setData({
      isPlaying:true
    })
  },

  musicPause(){
    this.setData({
      isPlaying:false
    })
  },

  //保存播放历史
  savePlayHistory(){
      //当前正在播放的音乐的索引(当前正在播放的歌曲)
      const music = musiclist[nowPlayingIndex]
      const openid = app.globalData.openid
      const history = wx.getStorageSync(openid)
      //表示当前歌曲是否存在Storage中
      let bHave = false
      for (let i = 0, len = history.length; i < len; i++){
          if(history[i].id == music.id){
              bHave = true
              break
          }
      }
      if(!bHave){
          history.unshift(music)
          wx.setStorageSync(openid, history)
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