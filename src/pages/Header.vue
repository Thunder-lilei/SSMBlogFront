<template>
  <div>
    <div v-show="logoutShow" class="demo-fit" style="margin: 30% 65% 20px 0;width: 100%">
      <div @click="changeHeadImg"  class="block">
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
        <br/><br/>
        <el-button @click="logout" type="danger" round>登出</el-button>
        <br/><br/>
        <router-link to='/White'>
          <el-button round style="">主页</el-button>
        </router-link>
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
      <br/><br/>
      <router-link to='/White'>
        <el-button round style="">主页</el-button>
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
    this.getLoginUser()
    bus.$on("changeLoginUserInfo",(message)=>{
      this.userInfo.userNickname = message.userNickname
      this.userInfo.userProfilePhoto = message.userProfilePhoto
    })
  },
  methods: {
    getLoginUser:function () {
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
    },
    logout:function () {
      const that = this
      this.$axios.post('/user/logout').then(response => {
        if (response.data.message === 'success') {
          that.logoutShow = false
          that.userInfo = ''
        } else {
          that.$message({
            showClose: true,
            message: '请登录！',
            type: 'warning'
          });
        }
        that.$router.push('/');
        that.$router.go(0)
      }).catch(
        function (error) {
          that.$message({
            showClose: true,
            message: error,
            type: 'warning'
          });
        })
    },
    changeHeadImg() {
      this.$prompt('请输入新头像地址', '更换头像', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        const that = this
        let data = new URLSearchParams();
        data.append("imgUrl", value)
        this.$axios.post('/user/changeHeadImg', data).then(response => {
          if (response.data.message === 'success') {
            that.$message({
              showClose: true,
              message: "变更成功",
              type: 'success'
            });
            that.userInfo.userProfilePhoto = value
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
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
