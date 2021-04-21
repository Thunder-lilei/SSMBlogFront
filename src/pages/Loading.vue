<template>
  <div class="loading"></div>
</template>

<script>
export default {
  name: 'Loading',
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
.loading {
  position: fixed;
  left: 0;
  top: 0;
  background: url('/static/img/loading.gif') center center no-repeat #fff;
  width: 100%;
  height: 100%;
  z-index: 1000;
}
</style>
