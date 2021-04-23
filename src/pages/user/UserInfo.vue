<template>
  <div class="userInfoBox">
<!--    <h1>个人信息</h1>-->
    <div>
      <div class="tagBox">
        <div class="tagTextLeft">
          当前用户：
        </div>
        <div class="tagTextRight">
          {{ loginUser.userNickname }}
        </div>
      </div>
      <div class="tagBox">
        <div class="tagTextLeft">
          联系方式：
        </div>
        <div class="tagTextRight">
          {{ loginUser.userEmail }}
        </div>
      </div>
    </div>

    <div v-if="isArticleUser" class="ArticleUserBox">
      <div class="tagBox">
        <div class="tagTextLeft">
          当前博主：
        </div>
        <div class="tagTextRight">
          {{ articleUserId }}
        </div>
      </div>
      <div class="tagBox">
        <div class="tagTextLeft">
          联系方式：
        </div>
        <div class="tagTextRight">
          {{  }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserInfo',
  data() {
    return {
      loginUser: {}, //当前用户
      articleUser: {}, //当前博主
      isArticleUser: false, //是否是其他博主
      articleUserId: '', //其他博主ID
    }
  },
  created () {
    this.getLoginUser()
  },
  methods: {
    getLoginUser() {
      const that = this
      this.$axios.post('/user/getLoginUser').then(response => {
        if (response.data.message === 'success') {
          that.loginUser = response.data.loginUser
        }else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
  }
}
</script>

<style scoped>
.userInfoBox {
  position: fixed;
}
.tagBox {
  width: 300px;
  display: flex;
  margin-bottom: 15px;
  background-color: #fdf6ec ;
  border-radius: 20px;
}
.tagTextLeft {
  width: 30%;
  color: #E6A23C;
  line-height: 40px;
  height: 40px;
}
.tagTextRight {
  color: #3e76f6;
  line-height: 40px;
  height: 40px;
}
.ArticleUserBox {
  margin-top: 60px;
}
</style>
