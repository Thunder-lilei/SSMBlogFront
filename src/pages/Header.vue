<template>
  <div>
    <h1>{{ name }}</h1>
    <el-button v-show="logoutShow" @click="logout" type="danger" round>登出</el-button>
  </div>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      name: '',
      logoutShow: false,
    }
  },
  mounted () {
    const that = this
    this.$axios.post('/user/getLoginUser').then(response => {
      if (response.data.message == 'success') {
        that.name = '当前用户：'+response.data.loginUser.userName
        that.logoutShow = true
      } else {
        that.name = response.data.message
      }
      console.log()
    }).catch(
      function (error) {
        that.$message({
          showClose: true,
          message: '请求失败！',
          type: 'warning'
        });
      })
  }
  ,
  methods: {
    logout:function () {
      const that = this
      this.$axios.post('/user/logout').then(response => {
        if (response.data.message == 'success') {
          that.logoutShow = false
          that.name = ''
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
