// components/blog-ctrl/blog-ctrl.js
let userInfo = {}
const db = wx.cloud.database()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        blogId:String,
        blog:Object,
        footerBottom:Number
    },

    externalClasses: ['iconfont', 'icon-pinglun', 'icon-fenxiang'],

    /**
     * 组件的初始数据
     */
    data: {
        loginShow:false,
        modelShow:false
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onComment(){
            //判断用户是否授权
            wx.getSetting({
                success: (res) => {
                    if(res.authSetting['scope.userInfo']){
                        wx.getUserInfo({
                            success: (res) => {
                                userInfo:res.userInfo
                                //显示评论的弹出层
                                this.setData({
                                    modelShow:true
                                })
                            }
                        })
                    }else{
                        this.setData({
                            loginShow:true
                        })
                    }
                }
            })  
        },

        onSuccess(event){
            userInfo = event.detail.userInfo
            //授权的框应该消失,评论的框显示
            this.setData({
                loginShow:false
            }, () => {
                this.setData({
                    modelShow:true
                })
            })

        },

        onFail(){
            wx.showModal({
                title: '授权用户才能评价',
                content: '',
            })
        },

        onSend(event){
            let formId = event.detail.formId
            let content = event.detail.value.content
            if(content.trim() == ''){
                wx.showModal({
                    title: '请输入相应的内容',
                    content: '',
                })
                return 
            }
            wx.showLoading({
                title: '评论成功',
                mask:true
            })
            //插入数据库
            db.collection('blog-comment').add({
                data:{
                    content,
                    createTime:db.serverDate(),
                    blogId:this.properties.blogId,
                    nickName:userInfo.nickName,
                    avatarUrl:userInfo.avatarUrl
                }
            }).then((res) => {

                //推送模板消息
                wx.cloud.callFunction({
                    name:'sendMessage',
                    data:{
                        content,
                        formId,
                        blogId:this.properties.blogId
                    }
                }).then((res) => {
                    console.log(res)
                })


                wx.hideLoading()
                this.setData({
                    modelShow:false,
                    content:''
                })
                //父元素刷新评论
                this.triggerEvent('refreshCommentList')
            })

        },

        onBindFocus(event){
            console.log(event)
            this.setData({
                footerBottom:event.detail.height
            })
            console.log(this.data.footerBottom)
        },

    }
})
