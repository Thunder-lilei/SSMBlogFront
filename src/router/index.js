import Vue from 'vue'
import Router from 'vue-router'

import TestMessage from '../components/TestMessage'
import Welcome from '../pages/Welcome'
import Login from '../pages/user/Login'
import Register from '../pages/user/Register'
import UpdateUser from '../pages/user/UpdateUser'
import NavMenu from '../pages/NavMenu'
import Header from '../pages/Header'
import UserControl from '../pages/admin/UserControl'
import ArticleControl from '../pages/article/ArticleControl'
import Article from '../pages/article/Article'
import ShowArticle from '../pages/article/ShowArticle'
import Friend from '../pages/Friend/Friend'
import Square from '../pages/article/Square'
import ShowUser from '../pages/user/ShowUser'
import GitTalk from '../components/gittalk/GitTalk'
import White from '../pages/White'
import Comment from '../pages/article/Comment'
import TelLogin from '../pages/user/TelLogin'
import EmailLogin from '../pages/user/EmailLogin'
import SortLabel from '../pages/article/SortLabel'
import DraftControl from '../pages/Draft/DraftControl'
import Loading from '../pages/Loading'
import UserInfo from '../pages/user/UserInfo'
import ArticleUserInfo from '../pages/user/ArticleUserInfo'

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
          path: '/SortLabel',
          name: 'SortLabel',
          component: SortLabel,
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
        {
          path: '/DraftControl',
          name: 'DraftControl',
          component: DraftControl,
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
      path: '/Loading',
      name: 'Loading',
      component: Loading,
    },
    {
      path: '/UserInfo',
      name: 'UserInfo',
      component: UserInfo,
    },
    {
      path: '/ArticleUserInfo',
      name: 'ArticleUserInfo',
      component: ArticleUserInfo,
    },
  ]
})
