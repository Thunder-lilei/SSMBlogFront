<template>
  <div>
    <div v-html="blog" class="markdown-body" style="background-color: white">
    </div>
    <br/>
    <el-button @click="toUpdateArticle(article.articleId)" type="primary" icon="el-icon-edit" circle></el-button>
    <el-badge style="margin: 0 0 0 3%" :value="article.articleCommentCount" :max="99" class="item">
      <el-button size="small">评论</el-button>
    </el-badge>
    <el-badge style="margin: 0 0 0 3%" :value="article.articleLikeCount" :max="10" class="item">
      <el-button size="small" icon="">点赞</el-button>
    </el-badge>
    <span style="color: white;margin: 0 0 0 5%;background-color: black;">{{ article.articleDate }}</span>
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
      article: {},
    }
  },
  mounted () {
    this.getArticle()
  },
  methods: {
    getArticle:function () {
      const that = this
      this.$axios.post('/article/getShowArticle').then(response => {
        if (response.data.message === 'success') {
          this.blog = marked(response.data.article.articleContent)
          this.article = response.data.article
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
      this.$axios.post('/article/setShowArticle', data).then(response => {
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
<style>
.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>
<style scoped>

</style>
