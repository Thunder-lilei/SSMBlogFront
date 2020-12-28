<template>
  <div>
    <div v-show="logoutShow" class="demo-fit" style="margin: 30% 65% 20px 0;width: 100%">
      <div class="block">
          <el-avatar shape="square" :size="100" :src="userInfo.userProfilePhoto"></el-avatar>
      </div>
      <div v-show="logoutShow">
        <h2 style="font-size: 20px;margin-left: 5%;color: black">当前用户：</h2>
        <h2 style="font-size: 20px;margin-left: 5%;color: aliceblue">{{ userInfo.userNickname }}</h2>
      </div>
      <div v-show="logoutShow">
        <router-link to='/UpdateUser'>
          <el-button type="primary" round>修改信息</el-button>
        </router-link>
        <el-button @click="logout" type="danger" round>登出</el-button>
      </div>
    </div>
    <div style="margin: 30% 65% 5% 0" v-show="!logoutShow">
      <router-link to='/Login'>
        <el-button type="primary" round>登录</el-button>
      </router-link>
      <br/><br/>
      <router-link to='/Register'>
        <el-button type="primary" round>注册</el-button>
      </router-link>
    </div>
  </div>
</template>

<script>
import bus from '../router/bus'
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
          message: error,
          type: 'warning'
        });
      })
    bus .$on("loginUser",(message)=>{
      this.userInfo.userNickname = message.userNickname
      this.userInfo.userProfilePhoto = message.userProfilePhoto
    })
  },
  methods: {
    logout:function () {
      const that = this
      this.$axios.post('/user/logout').then(response => {
        if (response.data.message === 'success') {
          that.logoutShow = false
          that.userInfo = ''
          that.$router.push('/');
        } else {
          that.$message({
            showClose: true,
            message: '请登录！',
            type: 'warning'
          });
          that.$router.push('/Login');
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

<style scoped>

</style>
