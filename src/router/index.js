import Vue from 'vue'
import Router from 'vue-router'

import TestMessage from '../components/TestMessage'
import Welcome from '../pages/Welcome'
import Login from '../user/Login'
import Register from '../user/Register'
import UpdateUser from '../user/UpdateUser'
import NavMenu from '../pages/NavMenu'
import Header from '../pages/Header'
import UserControl from '../admin/UserControl'
import ArticleControl from '../article/ArticleControl'
import Article from '../article/Article'
import ShowArticle from '../article/ShowArticle'
import Friend from '../Friend/Friend'
import Square from '../article/Square'
import ShowUser from '../user/ShowUser'
import GitTalk from '../components/gittalk/GitTalk'
import White from '../pages/White'
import Comment from '../article/Comment'
import TelLogin from '../user/TelLogin'
import EmailLogin from '../user/EmailLogin'

Vue.use(Router)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: Welcome,
      children: [
        {
          path: '/Login',
          name: 'Login',
          component: Login
        },
        {
          path: '/EmailLogin',
          name: 'EmailLogin',
          component: EmailLogin
        },
        {
          path: '/TelLogin',
          name: 'TelLogin',
          component: TelLogin
        },
        {
          path: '/UserControl',
          name: 'UserControl',
          component: UserControl
        },
        {
          path: '/Register',
          name: 'Register',
          component: Register
        },
        {
          path: '/UpdateUser',
          name: 'UpdateUser',
          component: UpdateUser
        },
        {
          path: '/ArticleControl',
          name: 'ArticleControl',
          component: ArticleControl
        },
        {
          path: '/Article',
          name: 'Article',
          component: Article,
        },
        {
          path: '/ShowArticle',
          name: 'ShowArticle',
          component: ShowArticle,
        },
        {
          path: '/Square',
          name: 'Square',
          component: Square,
        },
        {
          path: '/ShowUser',
          name: 'ShowUser',
          component: ShowUser,
        },
        {
          path: '/White',
          name: 'White',
          component: White,
        },
        {
          path: '/Comment',
          name: 'Comment',
          component: Comment,
        },
      ]
    },
    {
      path: '/TestMessage',
      name: 'TestMessage',
      component: TestMessage
    },
    {
      path: '/NavMenu',
      name: 'NavMenu',
      component: NavMenu,
      children: [
        {
          path: '/Friend',
          name: 'Friend',
          component: Friend
        },
      ]
    },
    {
      path: '/Header',
      name: 'Header',
      component: Header,
    },
    {
      path: '/ShowArticle',
      name: 'ShowArticle',
      component: ShowArticle,
      children: [
        {
          path: '/GitTalk',
          name: 'GitTalk',
          component: GitTalk,
        },
      ]
    },
  ]
})
