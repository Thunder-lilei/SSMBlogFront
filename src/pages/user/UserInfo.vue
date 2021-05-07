<template>
  <div class="userInfoBox">
<!--    <h1>个人信息</h1>-->
    <div v-show="JSON.stringify(loginUser) !== '{}'">
      <div class="tagBox">
        <div class="tagTextLeft">
          当前用户：
        </div>
        <div class="tagTextRight">
          <el-link class="linkText" @click="toArticleControl()">
            {{ loginUser.userNickname }}
            <i class="el-icon-view el-icon--right"></i>
          </el-link>
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
      <div class="tagBox">
        <div class="tagTextLeft">
          博文总数：
        </div>
        <div class="tagTextRight">
          {{ articleCount }}
        </div>
        <div class="tagTextLeft">
          粉丝数：
        </div>
        <div class="tagTextRight">
          {{ funCount }}
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
      articleUserId: '', //其他博主ID
      articleCount: '', //当前用户的博文数量
      funCount: '', //当前用户粉丝数量
    }
  },
  created () {
    this.getLoginUser()
  },
  methods: {
    toArticleControl() {
      this.$router.push({name:'ArticleControlBus'})
    },
    getLoginUser() {
      const that = this
      this.$axios.post('/user/getLoginUser').then(response => {
        if (response.data.message === 'success') {
          that.loginUser = response.data.loginUser
          that.getUserArticleCount(that.loginUser.userId)
          that.getUserFunCount(that.loginUser.userId)
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
          that.funCount = response.data.funCount
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
          that.articleCount = response.data.articleCount
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
  right: 100px;
}
.tagBox {
  width: 300px;
  display: flex;
  margin-bottom: 10px;
  background-color: #fdf6ec ;
  border-radius: 20px;
}
.tagTextLeft {
  width: 40%;
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
