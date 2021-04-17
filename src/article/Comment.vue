<template>
  <div>
    <div v-for="item in commentList" style="background-color: white;text-align: left;margin: 5% 0 0 0;font-size: 20px">
      <div class="commentBox">
        <strong style="color: #42b983;">
          <el-avatar class="headImg" :src="item.userBaseInfo.userProfilePhoto"></el-avatar>
          <el-link class="nameText" @click="toShowUser(item.userBaseInfo.userId)">
            <strong>{{ item.userBaseInfo.userNickname }}</strong>
            <i class="el-icon-view el-icon--right"></i>
          </el-link>
        </strong>
          <strong v-if="item.parentCommentUserBaseInfo !== null">
            {{ ' 回复：'}}
          </strong>
          <strong style="color: #42b983;" v-if="item.parentCommentUserBaseInfo !== null">
            <el-avatar :src="item.parentCommentUserBaseInfo.userProfilePhoto"></el-avatar>
            <el-link class="nameText" @click="toShowUser(item.parentCommentUserBaseInfo.userId)">
              <strong>{{ item.parentCommentUserBaseInfo.userNickname}}</strong>
              <i class="el-icon-view el-icon--right"></i>
            </el-link>
          </strong>
          <Strong>
            ：
          </Strong>
          <el-button type="text" @click="open(item.commentId)">
          <strong class="commentText">
            {{ item.commentContent }}
          </strong>
          </el-button>
          <br/>
          <strong>{{ item.commentDate }}</strong>
        </div>
      </div>
    <br/>
    <div>
      <el-form label-width="100px" class="demo-ruleForm">
        <el-form-item label="评论内容">
          <el-input v-model="comment.commentContent"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addComment(0)">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>


<script>
import bus from '../router/bus'

export default {
  name:'Comment',
  data(){
    return {
      articleId: '',
      commentList: [],
      comment: {
        articleId: '',
        parentCommentId: '',
        commentContent: '',
      },
    }
  },
  mounted () {
    bus.$on("articleId",(articleId)=> {
      this.getComment(articleId)
      this.articleId = articleId
      this.comment.articleId = articleId
    })
  },
  methods: {
    open(commentId) {
      this.$prompt('请输入评论内容', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        this.comment.commentContent = value
        this.addComment(commentId)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    addComment:function (commentId) {
      const that = this
      this.comment.parentCommentId = commentId
        this.$axios.post('/comment/addComment', this.comment).then(response => {
          if (response.data.message === 'success') {
            that.$message({
              showClose: true,
              message: "成功发表评论！",
              type: 'success'
            });
            that.getComment(this.articleId)
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
    getComment:function (articleId) {
      const that = this
      let data = new URLSearchParams();
      data.append("articleId", articleId)
      this.$axios.post('/comment/getComment', data).then(response => {
        if (response.data.message === 'success') {
          that.commentList = response.data.commentList
        } else {
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
      this.$router.push('/ArticleControl');
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
}
</script>


<style scoped>
.commentBox {
  margin: 0 3% 0 3%;
}
.commentBox .commentText {
  font-size: 20px;
}
.commentBox .headImg {
  margin-top: 10px;
}
.commentBox .nameText {
  color: #42b983;
  font-size: 20px;
  margin: 0 0 30px 0;
}
</style>

