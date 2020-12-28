<template>
  <div class='backGround'>
    <el-container>
      <el-aside width="200px">
        <NavMenu></NavMenu>
      </el-aside>
      <el-main>
        <h1 style="font-size: 50px">欢迎访问SSMBlog</h1>
        <div style="width: 50%;margin: auto;">
          <el-main>
            <router-view/>
          </el-main>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Header from './Header'
import NavMenu from './NavMenu'
export default {
  name: 'index',
  components: {NavMenu, Header},
  data () {
    return {
    }
  },
  methods: {
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

</style>
