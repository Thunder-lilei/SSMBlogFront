<template>
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
    <el-badge style="margin: 0 0 0 3%" :value="article.articleCommentCount" :max="99" class="item">
      <el-button @click="changeShowComment" size="small">评论</el-button>
    </el-badge>
    <el-badge style="margin: 0 0 0 3%" :value="article.articleLikeCount" :max="10" class="item">
      <el-button v-show="!ifHaveLikeResult" @click="addLike(article.articleId)" size="small" icon="">点赞</el-button>
      <el-button v-show="ifHaveLikeResult" @click="removeLike(article.articleId)" size="small" icon="">取消点赞</el-button>
    </el-badge>
    <span style="color: white;margin: 0 0 0 5%;background-color: black;">{{ article.articleDate }}</span>
    <div v-show="showComment">
      <Comment></Comment>
    </div>
  </div>
</template>
<script>
import marked from 'marked'
import 'github-markdown-css';
import GitTalk from '../components/gittalk/GitTalk'
import bus from '../router/bus'
import Comment from './Comment'

export default {

  name: 'ShowArticle',
  components: {Comment, GitTalk},
  data() {
    return {
      blog: '',
      article: {},
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
    }
  },
  mounted () {
    this.getArticle()
  },
  methods: {
    removeArticleLabel(labelId) {
      const that = this
      let data = new URLSearchParams();
      data.append("articleId", this.article.articleId)
      data.append("labelId", labelId)
      this.$axios.post('/articleLabel/removeArticleLabel', data).then(response => {
        if (response.data.message === 'success') {
          that.getArticleLabel(this.article.articleId)
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
    removeArticleSort(sortId) {
      const that = this
      let data = new URLSearchParams();
      data.append("articleId", this.article.articleId)
      data.append("sortId", sortId)
      this.$axios.post('/articleSort/removeArticleSort', data).then(response => {
        if (response.data.message === 'success') {
          that.getArticleSort(this.article.articleId)
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
    getArticleSort (articleId) {
      const that = this
      let data = new URLSearchParams();
      data.append("articleId", articleId)
      this.$axios.post('/articleSort/getArticleSort', data).then(response => {
        if (response.data.message === 'success') {
          this.checkedSorts = response.data.sortList
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
    ifHaveLike(articleId) {
      const that = this
      this.articleLike.articleId = articleId
      this.$axios.post('/like/ifHaveLike', this.articleLike).then(response => {
        if (response.data.message === 'success') {
          that.ifHaveLikeResult = response.data.ifHaveLikeResult
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
    addLike(articleId) {
      const that = this
      this.articleLike.articleId = articleId
      this.$axios.post('/like/addLike', this.articleLike).then(response => {
        if (response.data.message === 'success') {
          that.ifHaveLikeResult = true
          that.article.articleLikeCount = that.article.articleLikeCount+1
          that.$message({
            showClose: true,
            message: "点赞成功！",
            type: 'success'
          });
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
    removeLike(articleId) {
      const that = this
      this.articleLike.articleId = articleId
      this.$axios.post('/like/removeLike', this.articleLike).then(response => {
        if (response.data.message === 'success') {
          that.ifHaveLikeResult = false
          that.article.articleLikeCount = that.article.articleLikeCount-1
          that.$message({
            showClose: true,
            message: "取消点赞！",
            type: 'success'
          });
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
    getArticle:function () {
      const that = this
      this.$axios.post('/article/getShowArticle').then(response => {
        if (response.data.message === 'success') {
          that.blog = marked(response.data.article.articleContent)
          that.article = response.data.article
          that.ifHaveLike(response.data.article.articleId)
          that.getArticleLabel(response.data.article.articleId)
          that.getArticleSort(response.data.article.articleId)
          that.ifMyArticle(response.data.article.articleId)
          bus.$emit('articleId',that.article.articleId)
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
    ifMyArticle:function (articleId) {
      const that = this
      let data = new URLSearchParams();
      data.append("articleId", articleId)
      this.$axios.post('/article/ifMyArticle', data).then(response => {
        if (response.data.message === 'success') {
          that.ifOtherUser = !response.data.result
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

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
