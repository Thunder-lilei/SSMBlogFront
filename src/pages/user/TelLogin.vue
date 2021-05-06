<template>
  <div>
    <h1>电话登陆</h1>
    <h2 style="color: white">暂未购买短信服务，该功能暂时关闭</h2>
  </div>
</template>

<script>
export default {
  name: 'TelLogin',
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

<style scoped>

</style>
