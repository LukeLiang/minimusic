//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'cloudmusic-dev-o26dl',
        traceUser: true, //记录访问我们数据库的用户
      })
    }

    this.getOpenId()

    this.globalData = {
      playingMusicId:-1,
      openid:-1,
    }  //全局属性
  },

  setPlayingMusicId(musicId){
    this.globalData.playingMusicId = musicId
  },

  getPlayingMusicId(){
    return this.globalData.playingMusicId
  },

  getOpenId(){
      wx.cloud.callFunction({
          name:'login'
      }).then((res) => {
          const openid = res.result.openid
          this.globalData.openid = openid
          if(wx.getStorageSync(openid) == ''){
              //如果Storage中不存在才设置进去(存在还设置进去的话,会覆盖掉前面已经设置缓存的数据)
              wx.setStorageSync(openid, [])
          }
      })
  },

})
