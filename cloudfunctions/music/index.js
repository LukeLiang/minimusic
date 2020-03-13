// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')
const TcbRouter = require('tcb-router')
cloud.init()

const BASE_URL = 'http://musicapi.xiecheng.live'
// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({event})

  app.router('playlist',async (ctx,next) => {
    ctx.body =  await cloud.database().collection('playlist')
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get().then((res) => {
        console.log(res)
        return res
      })
  })

  app.router('musiclist', async (ctx, next) => {
    ctx.body = await axios.get(BASE_URL + '/playlist/detail?id=' + parseInt(event.playlistId))
      .then((res) => {
        return res.data
      })
  })

  app.router('musicUrl',async (ctx ,next) => {
    ctx.body = await axios.get(BASE_URL + '/song/url?id=' + parseInt(event.musicId)).then((res) => {
      return res.data
    })
  })

app.router('lyric',async (ctx,next) => {
  ctx.body = await axios.get(BASE_URL + '/lyric?id=' + parseInt(event.musicId)).then((res) => {
    return res.data
  })
})


  return app.serve()

}