<template>
  <div>
    <h1 v-show="!ifOtherUser">博文管理</h1>
      <div>
        <div class="otherUserTitle">
          <strong v-if="ifOtherUser">当前博主：</strong><strong style="color: aliceblue">{{ articleUser.userNickname }}</strong>
        </div>
        <div style="display: flex;">
          <router-link style="width: 20%" to='/Article'>
            <el-button v-if="!ifOtherUser" type="success" icon="el-icon-plus" circle></el-button>
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
          class="tableBox"
          >
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
                v-show="typeof sortId !== 'undefined' && sortId !== ''"
                @keyup.enter.native="getSortAboutArticleWithKey"
                v-model="keyValue"
                size="max"
                placeholder="输入关键字搜索"/>
              <el-input
                v-show="typeof labelId !== 'undefined' && labelId !== ''"
                @keyup.enter.native="getLabelAboutArticleWithKey"
                v-model="keyValue"
                size="max"
                placeholder="输入关键字搜索"/>
            </template>
            <template slot-scope="scope">
                  <el-tag class="tagBox" type="success">
                    <i class="el-icon-tickets dataIcon"></i>
                    {{ scope.row.articleCommentCount }}
                  </el-tag>
                  <el-tag class="tagBox" type="success">
                    <i class="el-icon-thumb dataIcon"></i>
                    {{ scope.row.articleLikeCount }}
                  </el-tag>
                  <el-tag class="tagBox" type="success">
                    <i class="el-icon-s-data dataIcon"></i>
                    {{ scope.row.articleViews }}
                  </el-tag>
  <!--              <el-button type="success" icon="el-icon-tickets" size="mini">{{ scope.row.articleCommentCount }}</el-button>-->
  <!--              <el-button type="success" icon="el-icon-thumb" size="mini">{{ scope.row.articleLikeCount }}</el-button>-->
  <!--              <el-button type="success" icon="el-icon-s-data" size="mini">{{ scope.row.articleViews }}</el-button>-->
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
          v-if="!ifOtherUser && !ifSortLabelArticle"
          @current-change="pageIndexChange"
          @size-change="pageSizeChange"
          background
          layout="total, sizes, prev, pager, next"
          :page-sizes="[5, 10, 20, 30]"
          :page-size=pageSize
          :total=total>
        </el-pagination>
        <el-pagination
          v-if="ifOtherUser && !ifSortLabelArticle"
          @current-change="otherPageIndexChange"
          @size-change="otherPageSizeChange"
          background
          layout="total, sizes, prev, pager, next"
          :page-sizes="[5, 10, 20, 30]"
          :page-size=pageSize
          :total=total>
        </el-pagination>
        <el-pagination
          v-if="typeof sortId !== 'undefined' && sortId !== ''"
          @current-change="sortAboutArticlePageIndexChange"
          @size-change="sortAboutArticlePageSizeChange"
          background
          layout="total, sizes, prev, pager, next"
          :page-sizes="[5, 10, 20, 30]"
          :page-size=pageSize
          :total=total>
        </el-pagination>
        <el-pagination
          v-if="typeof labelId !== 'undefined' && labelId !== ''"
          @current-change="labelAboutArticlepageIndexChange"
          @size-change="labelAboutArticlePageSizeChange"
          background
          layout="total, sizes, prev, pager, next"
          :page-sizes="[5, 10, 20, 30]"
          :page-size=pageSize
          :total=total>
        </el-pagination>
      </div>
    <div class="userInfoDiv">
      <UserInfo></UserInfo>
    </div>
    <div class="articleUserInfoDiv">
      <ArticleUserInfo v-bind:articleUser = "articleUser"
                       v-bind:articleUserArticleCount = "articleUserArticleCount"
                       v-bind:articleUserFunCount = "articleUserFunCount"
                       v-bind:articleUserNewArticleList = "articleUserNewArticleList"></ArticleUserInfo>
    </div>
  </div>
</template>

<script>
import Loading from '../Loading'
import ArticleUserInfo from '../user/ArticleUserInfo'
import UserInfo from '../user/UserInfo'
export default {
  name: 'ArticleControl',
  components: {UserInfo, ArticleUserInfo, Loading, Comment},
  data() {
    return {
      loadingData: true, //数据加载判定
      user: {},
      articleList: [],
      keyValue: '',
      total: 0,
      pageIndex: 0,
      pageSize: 10,
      ifOtherUser: false, //是否是其他博主
      ifSortLabelArticle: false,
      sortId: '', //当前选择的分类ID
      labelId: '', //当前选择的标签ID
      articleUserId: '', //其他博主ID
      articleUser: {}, //其他博主
      articleUserArticleCount: '', //其他博主博文总数
      articleUserFunCount: '', //其他博主粉丝数
      articleUserNewArticleList: [], //其他博主最新博文列表
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
          that.getUserArticleCount(that.articleUser.userId)
          that.getUserFunCount(that.articleUser.userId)
          that.getUserNewArticle(that.articleUser.userId)
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    getUserNewArticle(userId) {
      const that = this
      let param = {
        userId: userId,
      }
      this.$axios.post('/article/getUserNewArticle', param).then(response => {
        if (response.data.message === 'success') {
          that.articleUserNewArticleList = response.data.newArticleList
        }else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    getUserArticleCount(userId) {
      const that = this
      let param = {
        userId: userId,
      }
      this.$axios.post('/article/getUserArticleCount', param).then(response => {
        if (response.data.message === 'success') {
          that.articleUserArticleCount = response.data.articleCount
        }else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    getUserFunCount(userId) {
      const that = this
      let param = {
        userId: userId,
      }
      this.$axios.post('/userFriend/getUserFunCount', param).then(response => {
        if (response.data.message === 'success') {
          that.articleUserFunCount = response.data.funCount
        }else {
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
      data.append("pageNow", this.pageIndex)
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
      data.append("pageNow", this.pageIndex)
      data.append("pageSize", this.pageSize)
      data.append("labelId", this.labelId)
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
      this.sortId = this.$route.params.sortId
    },
    getLabelId:function () {
      this.labelId = this.$route.params.labelId
    },
    getUser:function () {
      const that = this
      this.articleUserId = this.$route.params.articleUserId
      if (this.articleUserId != null && this.articleUserId !== '') {
        that.getArticleUser()
        that.getAllArticle(that.pageIndex, that.pageSize, that.articleUserId)
        that.ifOtherUser = true
      } else {
          if (typeof that.sortId !== 'undefined' && that.sortId !== '') {
            that.getSortAboutArticle(that.sortId)
          } else if (typeof that.labelId !== 'undefined' && that.labelId !== '') {
            that.getLabelAboutArticle(that.labelId)
          } else {
            that.selectAllArticleBaseInfo(that.pageIndex, that.pageSize)
          }
      }
    },
    getSortAboutArticle:function (sort) {
      const that = this
      that.loadingData = true
      let data = new URLSearchParams();
      data.append("pageNow", this.pageIndex)
      data.append("pageSize", this.pageSize)
      data.append("sortId", this.sortId)
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
      data.append("pageNow", this.pageIndex)
      data.append("pageSize", this.pageSize)
      data.append("labelId", this.labelId)
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
      this.selectUserArticleBaseInfo(this.pageIndex, pageSize, this.articleUser.userId)
    },
    otherPageIndexChange:function(pageIndex) {
      this.pageIndex = pageIndex
      this.selectUserArticleBaseInfo(pageIndex, this.pageSize, this.articleUser.userId)
    },
    sortAboutArticlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getSortAboutArticle(this.pageIndex, pageSize, this.sortId)
    },
    sortAboutArticlePageIndexChange:function(pageIndex) {
      this.pageIndex = pageIndex
      this.getSortAboutArticle(pageIndex, this.pageSize, this.sortId)
    },
    labelAboutArticlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getLabelAboutArticle(this.pageIndex, pageSize, this.labelId)
    },
    labelAboutArticlepageIndexChange:function(pageIndex) {
      this.pageIndex = pageIndex
      this.getLabelAboutArticle(pageIndex, this.pageSize, this.labelId)
    },
    getAllArticle(pageIndex, pageSize, userId) {
      const that = this
      that.loadingData = true
      let data = new URLSearchParams();
      data.append("pageNow", this.pageIndex)
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
      if (this.keyValue !== null && this.keyValue !== '') {
        //包含关键词的查询
        this.selectAllArticleBaseInfoWithKey(this.pageIndex, pageSize)
      } else {
        this.selectAllArticleBaseInfo(this.pageIndex, pageSize)
      }
    },
    pageIndexChange:function(pageIndex) {
      this.pageIndex = pageIndex
      if (this.keyValue !== null && this.keyValue !== '') {
        //包含关键词的查询
        this.selectAllArticleBaseInfoWithKey(pageIndex, this.pageSize)
      } else {
        this.selectAllArticleBaseInfo(pageIndex, this.pageSize)
      }
    },
    selectUserArticleBaseInfo (pageIndex, pageSize, userId) {
      const that = this
      that.loadingData = true
      let param = {
        pageParam: {
          pageIndex: pageIndex,
          pageSize: pageSize,
        },
        userParam: {
          userId: userId,
        },
      }
      this.$axios.post('/article/selectUserArticleBaseInfo', param).then(response => {
        if (response.data.message === 'success') {
          that.articleList = response.data.articleList
          that.total = response.data.articleCount
          that.loadingData = false
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    selectAllArticleBaseInfoWithKey (pageIndex, pageSize) {
      const that = this
      that.loadingData = true
      let param = {
        pageParam: {
          pageIndex: pageIndex,
          pageSize: pageSize,
        },
        key: this.keyValue,
      }
      this.$axios.post('/article/selectAllArticleBaseInfoWithKey', param).then(response => {
        if (response.data.message === 'success') {
          that.articleList = response.data.articleList
          that.total = response.data.articleListCount
          that.loadingData = false
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    selectAllArticleBaseInfo (pageIndex, pageSize) {
      const that = this
      that.loadingData = true
      let data = new URLSearchParams();
      data.append("pageNow", pageIndex)
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
          that.$message.success("成功移除！")
          this.$router.push({name:'ArticleControl'});
          this.$router.go(0)
          // that.selectAllArticleBaseInfo(that.pageIndex, that.pageSize)
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
      if (JSON.stringify(this.articleUser) !== '{}') {
        this.$router.push({name:'ShowArticle', params: {articleId: articleId, articleUserId: this.articleUserId}});
      } else {
        this.$router.push({name:'ShowArticle', params: {articleId: articleId}});
      }
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
.otherUserTitle {
  font-size: 20px;
}
.userInfoDiv {
  position: fixed;
  top: 200px;
}
.articleUserInfoDiv {
  position: fixed;
  right: 100px;
  top: 400px;
}
.tableBox {
  width: 100%;
  border-radius: 25px;
}
.tagBox {
  width: 10%;
}
.dataIcon {
  width: 50%;
}
</style>
