<template>
  <div>
    <div v-html="blog" class="markdown-body">

    </div>
    <br/>
    <el-button @click="toUpdateArticle(articleId)" type="primary" icon="el-icon-edit" circle></el-button>
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
      articleId: '',
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
          this.articleId = response.data.article.articleId
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
    toUpdateArticle:function (articleId) {
      this.setArticle(articleId)
      this.$router.push('/Article');
    },
    setArticle:function (articleId) {
      const that = this
      let data = new URLSearchParams();
      data.append("articleId", articleId)
      this.$axios.post('/article/setArticle', data).then(response => {
        if (response.data.message === 'success') {

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
