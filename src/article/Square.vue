<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="color: #42b983;font-size: 25px">推荐博文</span>
      </div>
      <div style="display: flex" v-for="item in recommendArticleList" class="text item">
        <div style="text-align: left;height: 30px;width: 40%;font-size: 25px">
          <span style="color: #42b983;font-size: 15px;">博文标题：</span>
          <el-link @click="toShowArticle(item.articleId)">{{ item.articleTitle }}<i class="el-icon-view el-icon--right"></i> </el-link>
        </div>
        <div style="text-align: left;width: 40%;font-size: 25px">
          <span style="color: #42b983;font-size: 15px;">作者：</span>
          <el-link @click="toShowUser(item.userId)">{{ item.userBaseInfoPojo.userNickname }}<i class="el-icon-view el-icon--right"></i> </el-link>
        </div>
        <div style="width: 20%;text-align: left;">
          <el-button style="width: 40%" type="success" icon="el-icon-tickets" size="mini">{{ item.articleCommentCount }}</el-button>
          <el-button style="width: 40%" type="success" icon="el-icon-thumb" size="mini">{{ item.articleLikeCount }}</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Square',
  data() {
    return {
      recommendArticleList: [],
      recommendArticleSize: 5,
    }
  },
  mounted () {
    this.getRecommendArticle()
  },
  methods: {
    toShowArticle:function (articleId) {
      this.setArticle(articleId)
      this.$router.push('/ShowArticle');
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
    toShowUser:function (userId) {
      this.setUser(userId)
      this.$router.push('/ShowUser');
    },
    setUser:function (userId) {
      const that = this
      let data = new URLSearchParams();
      data.append("userId", userId)
      this.$axios.post('/user/setShowUser', data).then(response => {
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
    getRecommendArticle:function () {
      const that = this
      let data = new URLSearchParams();
      data.append("size", this.recommendArticleSize)
      this.$axios.post('/article/getRecommendArticle', data).then(response => {
        if (response.data.message === 'success') {
          that.recommendArticleList = response.data.recommendArticleList
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
