import VueRouter from 'vue-router'
import Vue from 'vue'

Vue.use(VueRouter)

/*登录*/
const  login = () =>import("@/page/login/login")

/*内容部分*/
const  articleManage = () =>import("@/page/content/manage-article")
const  postArticle = () =>import("@/page/content/post-article")
const  imageManage = () =>import("@/page/content/manage-image")
const  commentManage = () =>import("@/page/content/manage-comment")

/*首页*/
const  index = () =>import("@/page/dashboard/index")

/*运营*/
const  categoryManage = () =>import("@/page/operation/manage-category")
const  loopManage = () =>import("@/page/operation/loop")

/*设置*/
const  friendLink = () =>import("@/page/settings/friend-link")
const  webSizeInfo = () =>import("@/page/settings/web-size-info")
const  email = () =>import("@/page/settings/email")
const  info = () =>import("@/page/settings/info")

/*用户*/
const  list = () =>import("@/page/user/list")

/*布局*/
const  baseView = () =>import("@/layout/base-view")
const  rightView = () =>import("@/layout/right-content")


export const routes = [
    {
        path: '',
        component: baseView,
        redirect: '/index',
        children: [
            {
                path: "/index",
                name: '首页',
                icon: 'el-icon-s-home',
                hidden: false,
                component: index
            },
            {
                path: '/content',
                name: '内容',
                icon: 'el-icon-tickets',
                hidden: false,
                component: rightView,
                children: [
                    {
                        path: 'post-article',
                        name: '发表文章',
                        icon: 'el-icon-edit-outline',
                        hidden: false,
                        component: postArticle
                    },
                    {
                        path: 'manage-article',
                        name: '文章管理',
                        icon: 'el-icon-files',
                        hidden: false,
                        component: articleManage
                    },
                    {
                        path: 'manage-comment',
                        name: '评论管理',
                        icon: 'el-icon-chat-line-round',
                        hidden: false,
                        component: commentManage
                    },
                    {
                        path: 'manage-image',
                        name: '图片管理',
                        icon: 'el-icon-picture-outline',
                        hidden: false,
                        component: imageManage
                    }
                ]
            },
            {
                path: '/user',
                name: '用户',
                icon: 'el-icon-user',
                hidden: false,
                component: rightView,
                children: [
                    {
                        path: 'list',
                        name: '用户列表',
                        icon: 'el-icon-user-solid',
                        hidden: false,
                        component: list
                    }
                ]
            },
            {
                path: '/operation',
                name: '运营',
                icon: 'el-icon-s-operation',
                hidden: false,
                component: rightView,
                children: [
                    {
                        path: 'manage-category',
                        name: '分类管理',
                        icon: 'el-icon-receiving',
                        hidden: false,
                        component: categoryManage
                    },
                    {
                        path: 'loop',
                        icon: 'el-icon-picture-outline',
                        name: '轮播图管理',
                        hidden: false,
                        component: loopManage
                    }
                ]
            },
            {
                path: '/settings',
                name: '设置',
                icon: 'el-icon-setting',
                hidden: false,
                component: rightView,
                children: [
                    {
                        path: 'email',
                        name: '邮箱设置',
                        icon: 'el-icon-message',
                        hidden: false,
                        component: email
                    },
                    {
                        path: 'info',
                        name: '用户信息',
                        icon: 'el-icon-info',
                        hidden: false,
                        component: info
                    },
                    {
                        path: 'web-size-info',
                        name: '网站信息',
                        icon: 'el-icon-postcard',
                        hidden: false,
                        component: webSizeInfo
                    },
                    {
                        path: 'friend-link',
                        name: '友情链接',
                        icon: 'el-icon-link',
                        hidden: false,
                        component: friendLink
                    }
                ]
            }
        ]
    },
    {
        path: '/login',
        component: login
    }
]

const router = new VueRouter({
    routes // (缩写) 相当于 routes: routes
})

export default router;

