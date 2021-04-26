<template>
  <div>
    <div>
    <div style="display: flex;background-color: white;margin: 0 0 3% 0">
      <div style="width: 50%;margin: 1% 0 1% 0">
        <h3 style="margin: 0 0 1% 3%;text-align: left;">
          分类：
        </h3>
        <el-tag
          :key="sort.sortName"
          v-for="sort in checkedSorts"
          :disable-transitions="false"
          @close="removeArticleSort(sort.sortId)">
          {{sort.sortName}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="newSortVisible"
          v-model="newSort.sortName"
          ref="saveTagInput"
          size="small"
          @blur="addArticleSort"
        >
        </el-input>
      </div>
      <div style="width: 50%;margin: 1% 0 1% 0">
        <h3 style="margin: 0 0 1% 3%;text-align: left;">
          标签：
        </h3>
        <el-tag
          :key="label.labelName"
          v-for="label in checkedLabels"
          :disable-transitions="false"
          @close="removeArticleLabel(label.labelId)">
          {{label.labelName}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="newLabelVisible"
          v-model="newLabel.labelName"
          ref="saveTagInput"
          size="small"
          @blur="addArticleLabel"
        >
        </el-input>
      </div>
    </div>
    <div v-html="blog" class="markdown-body" style="background-color: white">
    </div>
    <br/>
    <el-button v-show="!ifOtherUser" @click="toUpdateArticle(article.articleId)" type="primary" icon="el-icon-edit" circle></el-button>
    <el-badge style="margin: 0 0 0 3%" :value="articleCommentNum" :max="99" class="item">
      <el-button v-if="!showComment" @click="changeShowComment" size="small">评论 ↓</el-button>
      <el-button v-if="showComment" @click="changeShowComment" size="small">评论 ↑</el-button>
    </el-badge>
    <el-badge style="margin: 0 0 0 3%" :value="article.articleLikeCount" :max="10" class="item">
      <img v-if="ifHaveLikeResult" @click="removeLike(article.articleId)" class="likeStyle" src="static/img/点赞.png">
      <img v-if="!ifHaveLikeResult" @click="addLike(article.articleId)" class="noLikeStyle" src="static/img/未点赞.png">
    </el-badge>
    <span style="color: white;margin: 0 0 0 5%;background-color: black;">{{ article.articleDate }}</span>
    <div v-show="showComment">
      <Comment v-bind:articleCommentNum = "articleCommentNum" v-on:changeArticleCommentNum = "setArticleCommentNum($event)"></Comment>
    </div>
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
import marked from 'marked'
import 'github-markdown-css';
import GitTalk from '../../components/gittalk/GitTalk'
import bus from '../../router/bus'
import Comment from './Comment'
import SortLabel from './SortLabel'
import UserInfo from '../user/UserInfo'
import ArticleUserInfo from '../user/ArticleUserInfo'

export default {
  name: 'ShowArticle',
  components: {ArticleUserInfo, UserInfo, SortLabel, Comment, GitTalk},
  data() {
    return {
      blog: '',
      article: {},
      articleCommentNum: '', //博文评论总数
      newLabel: {
        labelName: '',
      },
      newSort: {
        sortName: '',
      },
      articleLike: {
        articleId: '',
      },
      ifHaveLikeResult: false,
      ifOtherUser: '',
      showComment: false,
      articleId: '',
      newLabelVisible: false,
      newSortVisible: false,
      checkedSorts: [],
      checkedLabels: [],
      articleUser: {}, //其他博主
      articleUserArticleCount: '', //其他博主博文总数
      articleUserFunCount: '', //其他博主粉丝数
      articleUserNewArticleList: [], //其他博主最新博文列表
    }
  },
  created () {
    this.getArticle()
  },
  methods: {
    setArticleCommentNum(data) {
      this.articleCommentNum = data
    },
    getArticleCommentNum(articleId) {
      const that = this
      let param = {
        articleId : articleId,
      }
      this.$axios.post('/article/getArticleCommentNum', param).then(response => {
        if (response.data.message === 'success') {
          that.articleCommentNum = response.data.articleCommentNum
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    removeArticleLabel(labelId) {
      const that = this
      let data = new URLSearchParams();
      data.append("articleId", this.article.articleId)
      data.append("labelId", labelId)
      this.$axios.post('/articleLabel/removeArticleLabel', data).then(response => {
        if (response.data.message === 'success') {
          that.getArticleLabel(this.article.articleId)
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    showAddArticleLabelInput() {
      this.newLabelVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    addArticleLabel () {
      const that = this
      let data = new URLSearchParams();
      data.append("articleId", this.article.articleId)
      data.append("labelName", this.newLabel.labelName)
      this.$axios.post('/articleLabel/addArticleLabel', data).then(response => {
        if (response.data.message === 'success') {
          that.getArticleLabel(that.article.articleId)
          this.newLabelVisible = false;
          this.newLabel.labelName = '';
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    removeArticleSort(sortId) {
      const that = this
      let data = new URLSearchParams();
      data.append("articleId", this.article.articleId)
      data.append("sortId", sortId)
      this.$axios.post('/articleSort/removeArticleSort', data).then(response => {
        if (response.data.message === 'success') {
          that.getArticleSort(this.article.articleId)
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    showAddArticleSortInput() {
      this.newSortVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    addArticleSort () {
      const that = this
      let data = new URLSearchParams();
      data.append("articleId", this.article.articleId)
      data.append("sortName", this.newSort.sortName)
      this.$axios.post('/articleSort/addArticleSort', data).then(response => {
        if (response.data.message === 'success') {
          that.getArticleSort(that.article.articleId)
          this.newSortVisible = false;
          this.newSort.sortName = '';
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    changeShowComment:function () {
      this.showComment = !this.showComment
    },
    getArticleLabel (articleId) {
      const that = this
      let data = new URLSearchParams();
      data.append("articleId", articleId)
      this.$axios.post('/articleLabel/getArticleLabel', data).then(response => {
        if (response.data.message === 'success') {
          this.checkedLabels = response.data.labelList
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    getArticleSort (articleId) {
      const that = this
      let data = new URLSearchParams();
      data.append("articleId", articleId)
      this.$axios.post('/articleSort/getArticleSort', data).then(response => {
        if (response.data.message === 'success') {
          this.checkedSorts = response.data.sortList
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    ifHaveLike(articleId) {
      const that = this
      this.articleLike.articleId = articleId
      this.$axios.post('/like/ifHaveLike', this.articleLike).then(response => {
        if (response.data.message === 'success') {
          that.ifHaveLikeResult = response.data.ifHaveLikeResult
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    addLike(articleId) {
      const that = this
      this.articleLike.articleId = articleId
      this.$axios.post('/like/addLike', this.articleLike).then(response => {
        if (response.data.message === 'success') {
          that.ifHaveLikeResult = true
          that.article.articleLikeCount = that.article.articleLikeCount+1
          that.$message.success("点赞成功！")
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    removeLike(articleId) {
      const that = this
      this.articleLike.articleId = articleId
      this.$axios.post('/like/removeLike', this.articleLike).then(response => {
        if (response.data.message === 'success') {
          that.ifHaveLikeResult = false
          that.article.articleLikeCount = that.article.articleLikeCount-1
          that.$message.warning("取消点赞！")
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    getArticle:function () {
      const that = this
      let param = {
        articleId:this.$route.params.articleId,
      }
      this.$axios.post('/article/getArticle', param).then(response => {
        if (response.data.message === 'success') {
          that.blog = marked(response.data.article.articleContent)
          that.article = response.data.article
          that.ifHaveLike(response.data.article.articleId)
          that.getArticleLabel(response.data.article.articleId)
          that.getArticleSort(response.data.article.articleId)
          that.ifMyArticle(response.data.article.articleId)
          that.getArticleCommentNum(that.article.articleId)
          bus.$emit('articleId',that.article.articleId)
          bus.$emit('articleUserId',that.article.userId)
          //获取其他博主信息
          if (typeof this.$route.params.articleUserId !== 'undefined' && this.$route.params.articleUserId !== '') {
            that.ifOtherUser = true
            that.getArticleUser(this.$route.params.articleUserId)
          }
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
    ifMyArticle:function (articleId) {
      const that = this
      let data = new URLSearchParams();
      data.append("articleId", articleId)
      this.$axios.post('/article/ifMyArticle', data).then(response => {
        if (response.data.message === 'success') {
          that.ifOtherUser = !response.data.result
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    getArticleUser(userId) {
      let that = this
      let param = {
        userId: userId,
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
.userInfoDiv {
  position: fixed;
  top: 200px;
}
.articleUserInfoDiv {
  position: fixed;
  right: 100px;
  top: 400px;
}
</style>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.likeStyle {
  width: 40px;
  height: 40px;
}
.noLikeStyle {
  width: 40px;
  height: 40px;
  background-color: white;
}
</style>
