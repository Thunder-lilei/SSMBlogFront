<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="color: #42b983;font-size: 25px">推荐博文</span>
      </div>
      <div style="display: flex" v-for="item in recommendArticleList" class="text item">
        <div style="text-align: left;height: 30px;width: 35%;font-size: 25px">
          <span style="color: #42b983;font-size: 15px;">博文标题：</span>
          <el-link @click="toShowArticle(item.articleId, item.userId)">{{ item.articleTitle }}<i class="el-icon-view el-icon--right"></i> </el-link>
        </div>
        <div style="text-align: left;width: 35%;font-size: 25px">
          <span style="color: #42b983;font-size: 15px;">作者：</span>
          <el-link @click="toShowUser(item.userId)">{{ item.userBaseInfoPojo.userNickname }}<i class="el-icon-view el-icon--right"></i> </el-link>
        </div>
        <div style="width: 30%;text-align: left;">
          <el-button style="width: 27%" type="success" icon="el-icon-tickets" size="mini">{{ item.articleCommentCount }}</el-button>
          <el-button style="width: 27%" type="success" icon="el-icon-thumb" size="mini">{{ item.articleLikeCount }}</el-button>
          <el-button style="width: 27%" type="success" icon="el-icon-s-data" size="mini">{{ item.articleViews }}</el-button>
        </div>
      </div>
    </el-card>
    <el-card style="margin: 5% 0 0 0" class="box-card">
      <div slot="header" class="clearfix">
        <span style="color: #42b983;font-size: 25px">推荐博主</span>
      </div>
      <div style="display: flex" v-for="item in recommendUserList" class="text item">
        <div style="text-align: left;height: 30px;width: 70%;font-size: 25px">
          <span style="color: #42b983;font-size: 15px;">博主昵称：</span>
          <el-link @click="toShowUser(item.userId)">{{ item.userBaseInfoPojo.userNickname }}<i class="el-icon-view el-icon--right"></i> </el-link>
        </div>
        <div style="width: 30%;text-align: left;">
          <el-button style="width: 27%" type="success" icon="el-icon-tickets" size="mini">{{ item.sumCommentCount }}</el-button>
          <el-button style="width: 27%" type="success" icon="el-icon-thumb" size="mini">{{ item.sumLikeCount }}</el-button>
          <el-button style="width: 27%" type="success" icon="el-icon-s-data" size="mini">{{ item.sumViews }}</el-button>
        </div>
      </div>
    </el-card>
    <el-card style="margin: 5% 0 0 0" class="box-card">
      <el-input
        @keyup.enter.native="searchArticle(pageNow, pageSize)"
        v-model="keyValue"
        size="max"
        placeholder="输入关键字搜索"/>
      <div style="display: flex" v-for="item in articleList" class="text item">
        <div style="text-align: left;height: 30px;width: 35%;font-size: 25px">
          <span style="color: #42b983;font-size: 15px;">博文标题：</span>
          <el-link @click="toShowArticle(item.articleId, item.userId)">{{ item.articleTitle }}<i class="el-icon-view el-icon--right"></i> </el-link>
        </div>
        <div style="text-align: left;width: 35%;font-size: 25px">
          <span style="color: #42b983;font-size: 15px;">作者：</span>
          <el-link @click="toShowUser(item.userId)">{{ item.userBaseInfoPojo.userNickname }}<i class="el-icon-view el-icon--right"></i> </el-link>
        </div>
        <div style="width: 30%;text-align: left;">
          <el-button style="width: 27%" type="success" icon="el-icon-tickets" size="mini">{{ item.articleCommentCount }}</el-button>
          <el-button style="width: 27%" type="success" icon="el-icon-thumb" size="mini">{{ item.articleLikeCount }}</el-button>
          <el-button style="width: 27%" type="success" icon="el-icon-s-data" size="mini">{{ item.articleViews }}</el-button>
        </div>
      </div>
      <br/>
      <el-pagination
        @current-change="pageNowChange"
        @size-change="pageSizeChange"
        background
        layout="total, sizes, prev, pager, next"
        :page-sizes="[5, 10, 20, 30]"
        :page-size=pageSize
        :total=total>
      </el-pagination>
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
      recommendUserList: [],
      recommendUserSize: 5,
      articleList: [],
      keyValue: '',
      pageNow: 1,
      pageSize: 10,
      total: 0,
      articleUser: {}, //选择的博主信息
    }
  },
  mounted () {
    this.getRecommendArticle()
    this.getRecommendUser()
  },
  methods: {
    pageNowChange:function (pageNow) {
      this.pageNow = pageNow
      this.searchArticle(pageNow, this.pageSize)
    },
    pageSizeChange:function (pageSize) {
      this.pageSize = pageSize
      this.searchArticle(this.pageNow, pageSize)
    },
    searchArticle:function (pageNow, pageSize) {
      const that = this
      let data = new URLSearchParams();
      data.append("pageNow", pageNow)
      data.append("pageSize", pageSize)
      data.append("key", this.keyValue)
      this.$axios.post('/article/searchArticle', data).then(response => {
        if (response.data.message === 'success') {
          that.articleList = response.data.articlePageInfo.list
          that.total = response.data.articlePageInfo.total
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    toShowArticle:function (articleId, userId) {
      this.setArticle(articleId)
      this.setUser(userId)
      this.$router.push('/ShowArticle');
    },
    setArticle:function (articleId) {
      const that = this
      let data = new URLSearchParams();
      data.append("articleId", articleId)
      this.$axios.post('/article/setShowArticle', data).then(response => {
        if (response.data.message === 'success') {

        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    //设置状态中的博主ID 刷新页面获取当前博主信息
    toShowUser:function (userId) {
      this.setUser(userId)
      // this.$router.go(0)
      // this.$router.push({name:'UserInfo', params: {articleUserId: userId}});
      this.$router.push({name:'ArticleControl', params: {articleUserId: userId}});
      // this.$router.go(0)
      // this.$router.push('/ArticleControl');
    },
    setUser:function (userId) {
      const that = this
      let data = new URLSearchParams();
      data.append("userId", userId)
      this.$axios.post('/user/setShowUser', data).then(response => {
        if (response.data.message !== 'success') {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
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
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    getRecommendUser:function () {
      const that = this
      let data = new URLSearchParams();
      data.append("size", this.recommendUserSize)
      this.$axios.post('/article/getRecommendUser', data).then(response => {
        if (response.data.message === 'success') {
          that.recommendUserList = response.data.recommendUserList
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
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
.bodyDiv {
  width: 70%;
}
</style>
