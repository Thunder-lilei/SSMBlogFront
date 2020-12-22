<template>
  <div>
    <Header></Header>
    <h1>欢迎访问SSMBlog</h1>
    <!-- 直接跳转 -->
    <router-link to='/TestMessage'>
      <button>测试页面</button>
    </router-link>
    <router-link to='/Login'>
      <button>登录</button>
    </router-link>
  </div>
</template>

<script>
import Header from './Header'
export default {
  name: 'index',
  components: {Header},
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
