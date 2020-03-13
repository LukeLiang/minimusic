// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
//初始化云数据库
const db = cloud.database()
const axios = require('axios')
const URL = 'http://musicapi.xiecheng.live/personalized'
const playlistCollection = db.collection('playlist')
const MAX_LIMIT = 100  //云函数限制每次只能取100条数据

// 云函数入口函数
exports.main = async (event, context) => {
  // const list = await playlistCollection.get()
  const countResult = await playlistCollection.count()
  const total = countResult.total
  //向上取整  (ex:230 / 100 = 2.3 得到的值就是3)
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  const tasks = []
  for (let i = 0; i < batchTimes;i++){
    let promise = playlistCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()  //此时得到的是三个异步任务
    tasks.push(promise)
  } 

  let list  = {
    data:[]
  }

  if(tasks.length > 0){
    list = (await Promise.all(tasks)).reduce((acc,cur) => {
      return {
        data: acc.data.concat(cur.data)
      }
    })
  }

  const playlist = await axios.get(URL).then((res) => {
    // console.log(res.data.result)
    return res.data.result
  })

  const newData = []
  for(let i = 0,len1 = playlist.length; i < len1; i++){
    let flag = true
    for(let j = 0; len2 = list.data.length, j < len2; j++){
      if (playlist[i].id === list.data[j].id){
        flag = false
        break
      }
    }
    if(flag){
      newData.push(playlist[i])
    }
  }
  
  for (let i = 0; len = newData.length, i < len; i++){
    await playlistCollection.add({
      data:{
        ...newData[i],
        createTime:db.serverDate()
      }
    }).then((res) => {
      console.log('插入成功')
    }).catch((res) => {
      console.log('插入失败')
    })
  }
} 