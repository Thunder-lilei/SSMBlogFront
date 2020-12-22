<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div>
      <!-- 直接跳转 -->
      <router-link to='/TestMessage'>
        <button>直接跳转</button>
      </router-link>

      <!-- 带参数跳转 -->
      <router-link :to="{path:'TestMessage',query:{setid:123456}}">
        <button>携参跳转</button>
      </router-link>

    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: '欢迎来到我的Vue测试项目'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
