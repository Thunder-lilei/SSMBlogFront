<template>

</template>

<script>
export default {
  name: 'ArticleControlBus',
  data() {
    return {
      articleUserId: '', //接收的博主ID
    }
  },
  created () {
    this.articleUserId = this.$route.params.articleUserId
    console.log(this.articleUserId)
    if (typeof this.articleUserId !== 'undefined' && this.articleUserId !== null && this.articleUserId !== '' ) {
      this.$router.push({name:'ArticleControl', params: {articleUserId: this.articleUserId}});
    } else {
      this.$router.push({name:'ArticleControl'});
    }
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

<style scoped>

</style>
