<template>
  <div>
    <div v-show="logoutShow" class="demo-fit" style="display: flex;margin-left: 10%">
      <div class="block">
          <el-avatar shape="square" :size="100" :src="userInfo.userProfilePhoto"></el-avatar>
      </div>
      <div v-show="logoutShow" style="width: 30%">
        <h2 style="font-size: 20px;margin-left: 5%;color: black">当前用户：</h2>
        <h2 style="font-size: 20px;margin-left: 5%;color: #42b983">{{ userInfo.userNickname }}</h2>
      </div>
      <div v-show="logoutShow" style="margin: auto;">
        <router-link to='/UpdateUser'>
          <el-button type="primary" round>修改信息</el-button>
        </router-link>
        <el-button @click="logout" type="danger" round>登出</el-button>
      </div>
    </div>
    <div v-show="!logoutShow">
      <router-link to='/Login'>
        <el-button type="primary" round>登录</el-button>
      </router-link>
      <router-link to='/Register'>
        <el-button type="primary" round>注册</el-button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      userInfo: {
        userNickname: '',
        userProfilePhoto: '',
      },
      logoutShow: false,
    }
  },
  mounted () {
    const that = this
    this.$axios.post('/user/getLoginUser').then(response => {
      if (response.data.message === 'success') {
        that.userInfo.userNickname = response.data.loginUser.userNickname
        that.userInfo.userProfilePhoto = response.data.loginUser.userProfilePhoto
        that.logoutShow = true
      }
    }).catch(
      function (error) {
        that.$message({
          showClose: true,
          message: '请求失败！',
          type: 'warning'
        });
      })
  },
  methods: {
    logout:function () {
      const that = this
      this.$axios.post('/user/logout').then(response => {
        if (response.data.message === 'success') {
          that.logoutShow = false
          that.userInfo = ''
        } else {
          that.$message({
            showClose: true,
            message: '登出失败！',
            type: 'warning'
          });
        }
      }).catch(
        function (error) {
          that.$message({
            showClose: true,
            message: '请求失败！',
            type: 'warning'
          });
        })
    }
  }
}
</script>

<style scoped>

</style>
