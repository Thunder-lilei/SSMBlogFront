<template>
  <div>
    <div v-for="item in commentList" style="background-color: white;text-align: left;margin: 5% 0 0 0;font-size: 20px">
      <span :id="'comment'+item.commentId">
        <strong style="color: #42b983;margin: 0 0 0 5%">{{ item.userBaseInfo.userNickname }}</strong>
        <strong v-if="item.parentCommentUserBaseInfo !== null">
          {{ ' 回复：'}}
        </strong>
        <strong style="color: #42b983;" v-if="item.parentCommentUserBaseInfo !== null">
          {{ item.parentCommentUserBaseInfo.userNickname}}
        </strong>
        {{ '：' + item.commentContent }}
        <strong>{{ item.commentDate }}</strong>
      </span>
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
    }
  },
  mounted () {
    bus.$on("articleId",(articleId)=> {
      this.getComment(articleId)
    })
  },
  beforeDestroy () {
    // console.log(this.comments)
  },
  methods: {
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
  },
}
</script>


<style scoped>

</style>


