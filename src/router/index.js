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

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/Welcome',
      name: 'Welcome',
      component: Welcome,
      children: [
        {
          path: '/Login',
          name: 'Login',
          component: Login
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
      component: NavMenu
    },
    {
      path: '/',
      name: 'Welcome',
      component: Welcome
    },
    {
      path: '/UserControl',
      name: 'UserControl',
      component: UserControl
    },
    {
      path: '/ArticleControl',
      name: 'ArticleControl',
      component: ArticleControl,
      children: [
      ]
    },
    {
      path: '/Header',
      name: 'Header',
      component: Header,
      children: [
        {
          path: '/UpdateUser',
          name: 'UpdateUser',
          component: UpdateUser
        },
      ]
    },
  ]
})
