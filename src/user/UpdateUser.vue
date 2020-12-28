<template>
  <div>
        <el-alert v-show="loginUser.userPassword !== userPasswordConfirm" title="两次密码不一致" type="error"></el-alert>

        <el-form :model="loginUser" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="头像链接" prop="userProfilePhoto">
            <el-input type="url" v-model="loginUser.userProfilePhoto"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="loginUser.userName"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="userNickname">
            <el-input v-model="loginUser.userNickname"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="userPassword">
            <el-input v-model="loginUser.userPassword" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="userPassword">
            <el-input v-model="userPasswordConfirm" show-password></el-input>
          </el-form-item>
          <el-form-item label="生日" prop="userBirthday">
            <el-input type="date" v-model="loginUser.userBirthday"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="userEmail">
            <el-input type="email" v-model="loginUser.userEmail"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="userTelephoneNumber">
            <el-input type="tel" v-model="loginUser.userTelephoneNumber"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">确认修改</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
        <Footer></Footer>
  </div>
</template>

<script>
import Footer from '../pages/Footer'
import Header from '../pages/Header'
import NavMenu from '../pages/NavMenu'
import bus from '../router/bus'
export default {
  name: 'UpdateUser',
  components: {Header, Footer ,NavMenu},
  data() {
    return {
      loginUser: {},
      userPasswordConfirm: '',
      updateUserId: '',
      isUpdateUser: false,
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        userPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        userPasswordConfirm: [
          { required: true, message: '再次输入密码', trigger: 'blur' },
        ],
        userNickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
        ]
      }
    }
  },
  mounted () {
    this.getUpdateUser()
  },
  methods: {
    getUpdateUser:function () {
      const that = this
      this.$axios.post('/user/getUpdateUser').then(response => {
        if (response.data.message === 'success') {
          that.loginUser = response.data.updateUser
          that.userPasswordConfirm = response.data.updateUser.userPassword
          that.isUpdateUser = true
        }else {
          that.getLoginUser()
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
    getLoginUser() {
        const that = this
        this.$axios.post('/user/getLoginUser').then(response => {
          if (response.data.message === 'success') {
            that.loginUser = response.data.loginUser
            that.userPasswordConfirm = response.data.loginUser.userPassword
          }else {
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
    submitForm(formName) {
      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/user/updateUser', this.loginUser).then(response => {
            if (response.data.message === 'success') {
              that.$message({
                showClose: true,
                message: '修改完成！',
                type: 'success'
              });
              if (!that.isUpdateUser) {
                bus .$emit('changeLoginUserInfo',that.loginUser)
              }
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
        } else {
          this.$message({
            showClose: true,
            message: '请检查格式！',
            type: 'warning'
          });
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
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
