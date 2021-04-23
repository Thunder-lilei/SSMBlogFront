<template>
  <div>
    <h1 v-show="!ifOtherUser">博文管理</h1>
      <div>
        <div style="font-size: 20px">
          <strong v-show="ifOtherUser">当前博主：</strong><strong style="color: aliceblue">{{ articleUser.userNickname }}</strong>
        </div>
        <div style="display: flex;">
          <router-link style="width: 20%" to='/Article'>
            <el-button v-show="!ifOtherUser" type="success" icon="el-icon-plus" circle></el-button>
          </router-link>
          <el-dropdown style="width: 20%;margin: 0 0 0 60%" split-button type="primary">
            排序方式
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="articleListSortTotal" icon="el-icon-s-help">数据量排序</el-dropdown-item>
              <el-dropdown-item @click.native="articleListSort('articleCommentCount')" icon="el-icon-tickets">评论数排序</el-dropdown-item>
              <el-dropdown-item @click.native="articleListSort('articleLikeCount')" icon="el-icon-thumb">点赞数排序</el-dropdown-item>
              <el-dropdown-item @click.native="articleListSort('articleViews')" icon="el-icon-s-data">访问量排序</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <br/><br/>
        <el-table
          v-loading = "loadingData"
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
                v-show="!ifOtherUser && !ifSortLabelArticle"
                @keyup.enter.native="selectArticleBaseInfoByKey"
                v-model="keyValue"
                size="max"
                placeholder="输入关键字搜索"/>
              <el-input
                v-show="ifOtherUser && !ifSortLabelArticle"
                @keyup.enter.native="getArticleByUserIdAndKey"
                v-model="keyValue"
                size="max"
                placeholder="输入关键字搜索"/>
              <el-input
                v-show="sortId !== ''"
                @keyup.enter.native="getSortAboutArticleWithKey"
                v-model="keyValue"
                size="max"
                placeholder="输入关键字搜索"/>
              <el-input
                v-show="labelId !== ''"
                @keyup.enter.native="getLabelAboutArticleWithKey"
                v-model="keyValue"
                size="max"
                placeholder="输入关键字搜索"/>
            </template>
            <template slot-scope="scope">
              <el-button type="success" icon="el-icon-tickets" size="mini">{{ scope.row.articleCommentCount }}</el-button>
              <el-button type="success" icon="el-icon-thumb" size="mini">{{ scope.row.articleLikeCount }}</el-button>
              <el-button type="success" icon="el-icon-s-data" size="mini">{{ scope.row.articleViews }}</el-button>
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
          v-show="!ifOtherUser && !ifSortLabelArticle"
          @current-change="pageNowChange"
          @size-change="pageSizeChange"
          background
          layout="total, sizes, prev, pager, next"
          :page-sizes="[5, 10, 20, 30]"
          :page-size=pageSize
          :total=total>
        </el-pagination>
        <el-pagination
          v-show="ifOtherUser && !ifSortLabelArticle"
          @current-change="otherPageNowChange"
          @size-change="otherPageSizeChange"
          background
          layout="total, sizes, prev, pager, next"
          :page-sizes="[5, 10, 20, 30]"
          :page-size=pageSize
          :total=total>
        </el-pagination>
        <el-pagination
          v-show="sortId !== ''"
          @current-change="sortAboutArticlePageNowChange"
          @size-change="sortAboutArticlePageSizeChange"
          background
          layout="total, sizes, prev, pager, next"
          :page-sizes="[5, 10, 20, 30]"
          :page-size=pageSize
          :total=total>
        </el-pagination>
        <el-pagination
          v-show="labelId !== ''"
          @current-change="labelAboutArticlePageNowChange"
          @size-change="labelAboutArticlePageSizeChange"
          background
          layout="total, sizes, prev, pager, next"
          :page-sizes="[5, 10, 20, 30]"
          :page-size=pageSize
          :total=total>
        </el-pagination>
      </div>
  </div>
</template>

<script>
import Loading from '../Loading'
export default {
  name: 'ArticleControl',
  components: {Loading, Comment},
  data() {
    return {
      loadingData: true, //数据加载判定
      user: {},
      articleList: [],
      keyValue: '',
      total: 0,
      pageNow: 1,
      pageSize: 10,
      ifOtherUser: false, //是否是其他博主
      ifSortLabelArticle: false,
      sortId: '', //当前选择的分类ID
      labelId: '', //当前选择的标签ID
      articleUserId: '', //其他博主ID
      articleUser: '', //其他博主
    }
  },
  mounted () {
    this.getSortId()
    this.getLabelId()
    this.getUser()
  },
  methods: {
    getArticleUser() {
      const that = this
      let param = {
        userId: this.articleUserId,
      }
      this.$axios.post('/user/getArticleUser', param).then(response => {
        if (response.data.message === 'success') {
          that.articleUser = response.data.articleUser
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    articleListSortTotal:function() {
      this.articleList = this.articleList.sort(function (a, b) {
        let x = a['articleCommentCount'] + a['articleLikeCount'] + a['articleViews']
        let y = b['articleCommentCount'] + b['articleLikeCount'] + b['articleViews']
        return ((x > y) ? -1 : (x < y) ? 1 : 0)
      })
    },
    articleListSort:function(key) {
     this.articleList = this.articleList.sort(function (a, b) {
        let x = a[key]
        let y = b[key]
        return ((x > y) ? -1 : (x < y) ? 1 : 0)
      })
    },
    getSortAboutArticleWithKey:function () {
      const that = this
      that.loadingData = true
      let data = new URLSearchParams();
      data.append("pageNow", this.pageNow)
      data.append("pageSize", this.pageSize)
      data.append("sortId", this.sortId)
      data.append("key", this.keyValue)
      this.$axios.post('/article/getSortAboutArticleAndKey', data).then(response => {
        if (response.data.message === 'success') {
          that.ifSortLabelArticle = true
          that.articleList = response.data.articlePageInfo.list
          that.total = response.data.articlePageInfo.total
          that.loadingData = false
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    getLabelAboutArticleWithKey:function () {
      const that = this
      that.loadingData = true
      let data = new URLSearchParams();
      data.append("pageNow", this.pageNow)
      data.append("pageSize", this.pageSize)
      data.append("sortId", this.sortId)
      data.append("key", this.keyValue)
      this.$axios.post('/article/getLabelAboutArticleAndKey', data).then(response => {
        if (response.data.message === 'success') {
          that.ifSortLabelArticle = true
          that.articleList = response.data.articlePageInfo.list
          that.total = response.data.articlePageInfo.total
          that.loadingData = false
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    getSortId:function () {
      const that = this
      this.$axios.post('/article/getSortId').then(response => {
        if (response.data.message === 'success') {
          that.sortId = response.data.sortId
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    getLabelId:function () {
      const that = this
      this.$axios.post('/article/getLabelId').then(response => {
        if (response.data.message === 'success') {
          that.labelId = response.data.labelId
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    getUser:function () {
      const that = this
      this.articleUserId = this.$route.params.articleUserId
      if (this.articleUserId != null && this.articleUserId !== '') {
        that.getArticleUser()
        that.getAllArticle(that.pageNow, that.pageSize, that.articleUserId)
        that.ifOtherUser = true
      } else {
          if (that.sortId !== '') {
            that.getSortAboutArticle(that.sortId)
          } else if (that.labelId !== '') {
            that.getLabelAboutArticle(that.labelId)
          } else {
            that.selectAllArticleBaseInfo(that.pageNow, that.pageSize)
          }
      }
    },
    getSortAboutArticle:function (sortId) {
      const that = this
      that.loadingData = true
      let data = new URLSearchParams();
      data.append("pageNow", this.pageNow)
      data.append("pageSize", this.pageSize)
      data.append("sortId", sortId)
      this.$axios.post('/article/getSortAboutArticle', data).then(response => {
        if (response.data.message === 'success') {
          that.ifSortLabelArticle = true
          that.articleList = response.data.articlePageInfo.list
          that.total = response.data.articlePageInfo.total
          that.loadingData = false
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    getLabelAboutArticle:function (labelId) {
      const that = this
      that.loadingData = true
      let data = new URLSearchParams();
      data.append("pageNow", this.pageNow)
      data.append("pageSize", this.pageSize)
      data.append("labelId", labelId)
      this.$axios.post('/article/getLabelAboutArticle', data).then(response => {
        if (response.data.message === 'success') {
          that.ifSortLabelArticle = true
          that.articleList = response.data.articlePageInfo.list
          that.total = response.data.articlePageInfo.total
          that.loadingData = false
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    otherPageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.selectAllArticleBaseInfo(this.pageNow, pageSize, this.articleUser.userId)
    },
    otherPageNowChange:function(pageNow) {
      this.pageNow = pageNow
      this.selectAllArticleBaseInfo(pageNow, this.pageSize, this.articleUser.userId)
    },
    sortAboutArticlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getSortAboutArticle(this.pageNow, pageSize, this.sortId)
    },
    sortAboutArticlePageNowChange:function(pageNow) {
      this.pageNow = pageNow
      this.getSortAboutArticle(pageNow, this.pageSize, this.sortId)
    },
    labelAboutArticlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getLabelAboutArticle(this.pageNow, pageSize, this.labelId)
    },
    labelAboutArticlePageNowChange:function(pageNow) {
      this.pageNow = pageNow
      this.getLabelAboutArticle(pageNow, this.pageSize, this.labelId)
    },
    getAllArticle(pageNow, pageSize, userId) {
      const that = this
      that.loadingData = true
      let data = new URLSearchParams();
      data.append("pageNow", this.pageNow)
      data.append("pageSize", this.pageSize)
      data.append("userId", userId)
      this.$axios.post('/article/getArticleByUserId', data).then(response => {
        if (response.data.message === 'success') {
          that.articleList = response.data.articlePageInfo.list
          that.total = response.data.articlePageInfo.total
          that.loadingData = false
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
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
      that.loadingData = true
      let data = new URLSearchParams();
      data.append("pageNow", pageNow)
      data.append("pageSize", pageSize)
      this.$axios.post('/article/selectAllArticleBaseInfo', data).then(response => {
        if (response.data.message === 'success') {
          that.articleList = response.data.articlePageInfo.list
          that.total = response.data.articlePageInfo.total
          that.loadingData = false
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
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
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    toUpdateArticle:function (articleId) {
      this.setArticle(articleId)
      this.$router.push('/Article');
    },
    toShowArticle:function (articleId) {
      this.setArticle(articleId)
      if (JSON.stringify(this.articleUser) !== '{}') {
        this.setUser(this.articleUser.userId)
      }
      this.$router.push('/ShowArticle');
    },
    setArticle:function (articleId) {
      const that = this
      let data = new URLSearchParams();
      data.append("articleId", articleId)
      this.$axios.post('/article/setShowArticle', data).then(response => {
        if (response.data.message !== 'success') {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    getArticleByUserIdAndKey:function () {
      const that = this
      that.loadingData = true
      let data = new URLSearchParams();
      data.append("pageNow", "1")
      data.append("pageSize", "10")
      data.append("key", this.keyValue)
      data.append("userId", this.articleUser.userId)
      this.$axios.post('/article/getArticleByUserIdAndKey', data).then(response => {
        if (response.data.message === 'success') {
          that.articleList = response.data.articlePageInfo.list
          that.total = response.data.articlePageInfo.total
          that.loadingData = false
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    selectArticleBaseInfoByKey:function () {
      const that = this
      that.loadingData = true
      let data = new URLSearchParams();
      data.append("pageNow", "1")
      data.append("pageSize", "10")
      data.append("key", this.keyValue)
      this.$axios.post('/article/selectArticleBaseInfoByKey', data).then(response => {
        if (response.data.message === 'success') {
          that.articleList = response.data.articlePageInfo.list
          that.total = response.data.articlePageInfo.total
          that.loadingData = false
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
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
