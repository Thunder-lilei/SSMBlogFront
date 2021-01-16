<template>
  <div>
    <h1 v-show="!ifOtherUser">博文管理</h1>
    <div style="font-size: 20px">
      <strong v-show="ifOtherUser">当前博主：</strong><strong style="color: aliceblue">{{ user.userNickname }}</strong>
    </div>
    <router-link to='/Article'>
      <el-button v-show="!ifOtherUser" type="success" icon="el-icon-plus" circle></el-button>
    </router-link>
    <br/><br/>
    <el-table
      :data="articleList"
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="articleTitle"
        label="标题"
        width="180"
      >
        <template slot-scope="scope">
          <el-link @click="toShowArticle(scope.row.articleId)">{{ scope.row.articleTitle }}<i class="el-icon-view el-icon--right"></i> </el-link>
        </template>
      </el-table-column>
      <el-table-column
        align="right">
        <template slot="header" slot-scope="scope">
          <el-input
            v-show="!ifOtherUser"
            @keyup.enter.native="selectArticleBaseInfoByKey"
            v-model="keyValue"
            size="max"
            placeholder="输入关键字搜索"/>
          <el-input
            v-show="ifOtherUser"
            @keyup.enter.native="getArticleByUserIdAndKey"
            v-model="keyValue"
            size="max"
            placeholder="输入关键字搜索"/>
        </template>
        <template slot-scope="scope">
          <el-button v-show="!ifOtherUser" @click="toUpdateArticle(scope.row.articleId)" type="primary" icon="el-icon-edit" circle></el-button>
          <el-popconfirm
            v-show="!ifOtherUser"
            title="确定删除吗？"
            @confirm="deleteArticle(scope.row.articleId)"
          >
            <el-button slot="reference" type="danger" icon="el-icon-delete" circle></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <br/>
    <el-pagination
      v-show="!ifOtherUser"
      @current-change="pageNowChange"
      @size-change="pageSizeChange"
      background
      layout="total, sizes, prev, pager, next"
      :page-sizes="[5, 10, 20, 30]"
      :page-size=pageSize
      :total=total>
    </el-pagination>
    <el-pagination
      v-show="ifOtherUser"
      @current-change="otherPageNowChange"
      @size-change="otherPageSizeChange"
      background
      layout="total, sizes, prev, pager, next"
      :page-sizes="[5, 10, 20, 30]"
      :page-size=pageSize
      :total=total>
    </el-pagination>
  </div>
</template>

<script>
import bus from '../router/bus'

export default {
  name: 'ArticleControl',
  components: {Comment},
  data() {
    return {
      user: {},
      articleList: [],
      keyValue: '',
      total: 0,
      pageNow: 1,
      pageSize: 10,
      ifOtherUser: false,
    }
  },
  mounted () {
    this.getUser()
  },
  methods: {
      getUser:function () {
        const that = this
        this.$axios.post('/user/getShowUser').then(response => {
          if (response.data.message === 'success') {
            that.user = response.data.user
            that.getAllArticle(this.pageNow, this.pageSize, that.user.userId)
            that.ifOtherUser = true
          } else {
            that.selectAllArticleBaseInfo(that.pageNow, that.pageSize)
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
    otherPageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.selectAllArticleBaseInfo(this.pageNow, pageSize, this.user.userId)
    },
    otherPageNowChange:function(pageNow) {
      this.pageNow = pageNow
      this.selectAllArticleBaseInfo(pageNow, this.pageSize, this.user.userId)
    },
    getAllArticle(pageNow, pageSize, userId) {
      const that = this
      let data = new URLSearchParams();
      data.append("pageNow", this.pageNow)
      data.append("pageSize", this.pageSize)
      data.append("userId", userId)
      this.$axios.post('/article/getArticleByUserId', data).then(response => {
        if (response.data.message === 'success') {
          that.articleList = response.data.articlePageInfo.list
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
    pageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.selectAllArticleBaseInfo(this.pageNow, pageSize)
    },
    pageNowChange:function(pageNow) {
      this.pageNow = pageNow
      this.selectAllArticleBaseInfo(pageNow, this.pageSize)
    },
    selectAllArticleBaseInfo:function (pageNow, pageSize) {
      const that = this
      let data = new URLSearchParams();
      data.append("pageNow", pageNow)
      data.append("pageSize", pageSize)
      this.$axios.post('/article/selectAllArticleBaseInfo', data).then(response => {
        if (response.data.message === 'success') {
          that.articleList = response.data.articlePageInfo.list
          that.total = response.data.articlePageInfo.total
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
    deleteArticle:function (articleId) {
      const that = this
      let data = new URLSearchParams();
      data.append("articleId", articleId)
      this.$axios.post('/article/deleteArticle', data).then(response => {
        if (response.data.message === 'success') {
          that.$message({
            showClose: true,
            message: "成功移除",
            type: 'success'
          });
          that.selectAllArticleBaseInfo(that.pageNow, that.pageSize)
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
    toShowArticle:function (articleId) {
      this.setArticle(articleId)
      if (JSON.stringify(this.user) !== '{}') {
        this.setUser(this.user.userId)
      }
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
    getArticleByUserIdAndKey:function () {
      const that = this
      let data = new URLSearchParams();
      data.append("pageNow", "1")
      data.append("pageSize", "10")
      data.append("key", this.keyValue)
      data.append("userId", this.user.userId)
      this.$axios.post('/article/getArticleByUserIdAndKey', data).then(response => {
        if (response.data.message === 'success') {
          that.articleList = response.data.articlePageInfo.list
          that.total = response.data.articlePageInfo.total
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
    selectArticleBaseInfoByKey:function () {
      const that = this
      let data = new URLSearchParams();
      data.append("pageNow", "1")
      data.append("pageSize", "10")
      data.append("key", this.keyValue)
      this.$axios.post('/article/selectArticleBaseInfoByKey', data).then(response => {
        if (response.data.message === 'success') {
          that.articleList = response.data.articlePageInfo.list
          that.total = response.data.articlePageInfo.total
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
