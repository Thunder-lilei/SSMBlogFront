<template>

</template>

<script>
export default {
  name: 'ArticleBus',
  created () {
    let articleId = this.$route.params.articleId
    let articleUserId = this.$route.params.articleUserId
    this.$router.push({name:'ShowArticle', params: {articleId: articleId, articleUserId: articleUserId}});
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
