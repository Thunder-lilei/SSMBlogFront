<template>
  <div v-html="blog" class="markdown-body">
  </div>
</template>

<script>
import marked from 'marked'
import 'github-markdown-css';

export default {

  name: 'ShowArticle',
  data() {
    return {
      blog: '',
    }
  },
  mounted () {
    this.getArticle()
  },
  methods: {
    getArticle:function () {
      const that = this
      this.$axios.post('/article/getArticle').then(response => {
        if (response.data.message === 'success') {
          this.blog = marked(response.data.article.articleContent)
        } else {
          that.$message({
            showClose: true,
            message: response.data.message,
            type: 'warning'
          });
        }
      }).catch(
        function (error) {
          that.$message({
            showClose: true,
            message: error,
            type: 'warning'
          });
        })
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

<style scoped>

</style>
