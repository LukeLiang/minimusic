// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const { OPENID } = cloud.getWXContent()

    const result = await cloud.openapi.templateMessage.send({
        touser: OPENID,
        page:`/pages/blog-comment/blog-comment?blogId=${event.blogId}`,
        data:{
            keyword1:{
                value:event.content
            },
            keyword2:{
                value:'评价完成'
            }
        },
        templateId: 'MuBHR2j8ygg6mPr2WzKKPQ1Lcgy4r45i8Kgj6IzTsIc',
        formId:event.formId
    })
    return result
}