<template>
  <div class='backGround'>
    <el-container>
      <el-aside width="200px">
        <NavMenu></NavMenu>
      </el-aside>
      <el-main>
<!--        <h1 style="font-size: 50px">欢迎访问SSMBlog</h1>-->
        <div class="bodyBox">
          <div class="divBox">
            <el-main>
              <router-view/>
            </el-main>
          </div>
          <div class="showUserInfo">
            <UserInfo></UserInfo>
          </div>
          <div>
            <el-button class="toTop" v-if="btnFlag" type="primary" icon="el-icon-caret-top" @click="backTop" circle></el-button>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Header from './Header'
import NavMenu from './NavMenu'
import GitTalk from '../components/gittalk/GitTalk'
import UserInfo from './user/UserInfo'

export default {
  name: 'index',
  components: {UserInfo, GitTalk, NavMenu, Header},
  data () {
    return {
      btnFlag: false, //回到顶部按钮是否显示
      scrollTop: '', //顶部距离
    }
  },
  mounted () {
    window.addEventListener('scroll', this.scrollToTop)
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollToTop);
  },
  methods: {
    // 点击图片回到顶部方法，加计时器是为了过渡顺滑
    backTop () {
      const that = this
      let timer = setInterval(() => {
        let ispeed = Math.floor(-that.scrollTop / 5)
        document.documentElement.scrollTop = document.body.scrollTop = that.scrollTop + ispeed
        if (that.scrollTop === 0) {
          clearInterval(timer)
        }
      }, 16)
    },

    // 为了计算距离顶部的高度，当高度大于60显示回顶部图标，小于60则隐藏
    scrollToTop () {
      const that = this
      that.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      that.btnFlag = that.scrollTop > 60;
    },
  },
  beforeRouteEnter(to, from, next) {
    // 添加背景色 margin:0;padding:0是为了解决vue四周有白边的问题
    document.querySelector('body').setAttribute('style', 'margin:0;padding:0')
    next()
  },
  beforeRouteLeave(to, from, next) {
    // 去除背景色
    document.querySelector('body').setAttribute('style', '')
    next()
  },
}
</script>
<style>
.backGround {
  background: url('../assets/back.jpeg') center top no-repeat;
  background-size: 100% 100%;
}
</style>
<style scoped>
.bodyBox {
  display: flex;
}
.divBox {
  width: 50%;
  margin: auto;
}
.showUserInfo {
  width: 15%;
  height: 500px;
  margin-top: 165px;
  margin-right: 100px;
  /*background-color: white;*/
}
.toTop {
  position: fixed;
  height: 50px;
  width: 50px;
  bottom: 50px;
  right: 50px;
}
</style>
