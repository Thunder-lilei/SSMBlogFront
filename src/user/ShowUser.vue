<template>
  <div>
    <h1>{{ user.userNickname }}</h1>
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
            @keyup.enter.native="selectArticleBaseInfoByKey"
            v-model="keyValue"
            size="max"
            placeholder="输入关键字搜索"/>
        </template>
      </el-table-column>
    </el-table>
    <br/>
    <el-pagination
      @current-change=""
      @size-change=""
      background
      layout="total, sizes, prev, pager, next"
      :page-sizes="[5, 10, 20, 30]"
      :page-size=pageSize
      :total=total>
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'ShowUser',
  data() {
    return {
      user: {},
      articleList: [],
      keyValue: '',
      total: 0,
      pageNow: 1,
      pageSize: 10,
    }
  },
  mounted () {
    this.getUser()
  },
  methods: {
    getAllArticle(userId) {
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
    getUser:function () {
      const that = this
      this.$axios.post('/user/getShowUser').then(response => {
        if (response.data.message === 'success') {
          that.user = response.data.user
          that.getAllArticle(that.user.userId)
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
