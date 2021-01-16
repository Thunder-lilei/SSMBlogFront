<template>
  <div>
    <div v-for="item in rootComment" style="background-color: white">
      <h1 :id="'comment'+item.commentId">{{ item.commentContent }}</h1>
    </div>
  </div>
</template>


<script>
import bus from '../router/bus'

export default {
  name:'Comment',
  data(){
    return {
      rootComment: [],
      articleId: '',
    }
  },
  mounted () {
    bus.$on("articleId",(articleId)=> {
      this.getRootComment(articleId)
    })
  },
  methods: {
    getRootComment:function (articleId) {
      const that = this
      let data = new URLSearchParams();
      data.append("articleId", articleId)
      this.$axios.post('/comment/getRootComment', data).then(response => {
        if (response.data.message === 'success') {
          that.rootComment = response.data.rootComment
          that.rootComment.map((item) => {
            let temp = JSON.parse(JSON.stringify(item))//为了防止错误发生，采用深拷贝
            that.getChildComment(articleId, temp.commentId)
          })
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
    getChildComment:function (articleId, commentId) {
      const that = this
      let data = new URLSearchParams();
      data.append("articleId", articleId)
      data.append("commentId", commentId)
      this.$axios.post('/comment/getChildComment', data).then(response => {
        if (response.data.message === 'success') {
          let childComment = response.data.childComment
          childComment.map((item) => {
            let temp = JSON.parse(JSON.stringify(item))//为了防止错误发生，采用深拷贝

            let parentCommentTag = document.getElementById('comment'+commentId)
            //避免重复创建，原因未知
            if (!document.getElementById('comment'+item.commentId)) {
              let childCommentTag = document.createElement("strong")
              childCommentTag.innerText = item.commentContent
              childCommentTag.id = 'comment'+item.commentId
              parentCommentTag.appendChild(document.createElement("br"))
              parentCommentTag.appendChild(childCommentTag)
            }

            that.getChildComment(articleId, temp.commentId)
          })
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
  },
}
</script>


<style scoped>

</style>


