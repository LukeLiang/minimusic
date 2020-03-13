// components/search/index.js
let keyWords = ''
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pld:{
      type:String,
      value:'请输入关键字'
    }
  },

  externalClasses:[
    'iconfont',
    'icon-sousuo'
  ],

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onInput(event){
      // console.log(event)
      keyWords = event.detail.value
      this.triggerEvent('inp', {keyWords})
    },

    onSearch(){
      this.triggerEvent('search', {keyWords})
    },
  }
})
