<template>
  <div v-loading="commentLoading">
    <div class="commentListBox" v-for="item in commentList">
      <div class="commentBox">
        <div class="commentBoxLeft">
          <strong style="color: #42b983;">
            <el-avatar class="headImg" :src="item.userBaseInfo.userProfilePhoto"></el-avatar>
            <el-link class="nameText" @click="toShowUser(item.userBaseInfo.userId)">
              <strong class="articleUserName" v-if="articleUserId === item.userId">博主</strong>
              <strong v-else>{{ item.userBaseInfo.userNickname }}</strong>
              <i class="el-icon-view el-icon--right"></i>
            </el-link>
          </strong>
          <strong v-if="item.parentCommentUserBaseInfo !== null">
            {{ ' 回复：'}}
          </strong>
          <strong style="color: #42b983;" v-if="item.parentCommentUserBaseInfo !== null">
            <el-avatar :src="item.parentCommentUserBaseInfo.userProfilePhoto"></el-avatar>
            <el-link class="nameText" @click="toShowUser(item.parentCommentUserBaseInfo.userId)">
              <strong class="articleUserName" v-if="articleUserId === item.parentCommentUserBaseInfo.userId">博主</strong>
              <strong v-else>{{ item.parentCommentUserBaseInfo.userNickname }}</strong>
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
        </div>
        <div class="commentBoxRight">
          <el-popconfirm
            v-if="loginUser.userId == articleUserId"
            title="确定删除吗？"
            @confirm="deleteComment(item.commentId)"
          >
            <el-button class="deleteComment" slot="reference" type="danger" >删除评论</el-button>
          </el-popconfirm>
        </div>
      </div>
      <br/>
      <strong class="commentDate">{{ item.commentDate }}</strong>
    </div>
    <br/>
    <div class="commentFormBox">
        <el-form label-width="100px" class="demo-ruleForm commentForm">
          <el-form-item class="commentFormInput el-form-item__label" label="评论内容">
            <el-input v-model="comment.commentContent"></el-input>
          </el-form-item>
          <el-form-item class="commentFormButton" >
            <el-button type="primary" @click="addComment(0)">提交</el-button>
          </el-form-item>
        </el-form>
    </div>
  </div>
</template>


<script>
import bus from '../../router/bus'

export default {
  name:'Comment',
  props: ["articleCommentNum"],
  data(){
    return {
      articleId: '', //博文id
      articleUserId: '', //当前博文的作者ID
      commentList: [], //评论列表
      comment: {
        articleId: '',
        parentCommentId: '',
        commentContent: '',
      },
      loginUser: {}, //当前登录的用户
      commentLoading: false, //获取评论加载事件
    }
  },
  mounted () {
    bus.$on("articleId",(articleId)=> {
      this.getComment(articleId)
      this.articleId = articleId
      this.comment.articleId = articleId
    })
    bus.$on("articleUserId",(articleUserId)=> {
      this.articleUserId = articleUserId
    })
  },
  created () {
    this.getLoginUser()
  },
  methods: {
    getLoginUser:function () {
      const that = this
      this.$axios.post('/user/getLoginUser').then(response => {
        if (response.data.message === 'success') {
          that.loginUser = response.data.loginUser
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
    deleteComment(commentId) {
      let that = this
      let param = {
        commentId : commentId,
      }
      this.$axios.post('/comment/deleteComment', param).then(response => {
        if (response.data.message === 'success') {
          that.$message({
            showClose: true,
            message: "成功删除评论！",
            type: 'success'
          });
          that.$emit("changeArticleCommentNum", that.articleCommentNum - 1)
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
            that.comment.commentContent = ''
            that.$emit("changeArticleCommentNum", that.articleCommentNum + 1)
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
      this.commentLoading = true
      const that = this
      let data = new URLSearchParams();
      data.append("articleId", articleId)
      this.$axios.post('/comment/getComment', data).then(response => {
        if (response.data.message === 'success') {
          that.commentList = response.data.commentList
          this.commentLoading = false
        } else {
          that.$message({
            showClose: true,
            message: response.data.message,
            type: 'warning'
          });
          this.commentLoading = true
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
      this.$router.push({name:'ArticleControl', params: {articleUserId: userId}});
    },
  },
}
</script>

<style scoped>
.articleUserName {
  color: red;
}
.commentListBox {
  border-radius: 25px;
  background-color: white;
  text-align: left;
  margin-top: 1%;
  font-size: 20px;
}
.commentBox {
  margin: 0 3% 0 3%;
  display: flex;
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
.commentBoxLeft {
  width: 85%;
}
.commentBoxRight {
 width: 15%;
}
.commentBoxRight .deleteComment {
  margin: 20px 0 0 0;
}
.commentDate {
  margin-left: 3%;
}
.commentFormBox {
  /*border-radius: 25px;*/
  /*height: 70px;*/
}
.commentForm {
  display: flex;
}
.commentFormInput {
  width: 70%;
}
.commentFormButton {
  width: 30%;
}
</style>

