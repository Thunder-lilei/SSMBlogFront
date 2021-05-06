<template>
  <div>
    <div v-show="userNameLoginShow">
      <h1>账号登录</h1>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="ruleForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="userPassword">
          <el-input v-model="ruleForm.userPassword" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button plain>忘记密码</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-show="telLoginShow">
      <TelLogin></TelLogin>
    </div>
    <div v-show="emailLoginShow">
      <EmailLogin></EmailLogin>
    </div>
    <div>
      <el-button @click="showUserNameLogin" v-show="!userNameLoginShow" type="primary" plain>账号登陆</el-button>
      <el-button @click="showTelLogin" v-show="!telLoginShow" type="primary" plain>电话登陆</el-button>
      <el-button @click="showEmailLogin" v-show="!emailLoginShow" type="primary" plain>邮箱登陆</el-button>
    </div>
  </div>
</template>

<script>
import Footer from '../Footer'
import bus from '../../router/bus'
import TelLogin from './TelLogin'
import EmailLogin from './EmailLogin'
export default {
  name: 'Login',
  components: {EmailLogin, TelLogin, Footer},
  data() {
    return {
      ruleForm: {
        userName: '',
        userPassword: '',
      },
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        userPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ]
      },
      userNameLoginShow: true,
      telLoginShow: false,
      emailLoginShow: false,
    }
  },
  methods: {
    showTelLogin:function () {
      this.telLoginShow = true
      this.userNameLoginShow = false
      this.emailLoginShow = false
    },
    showEmailLogin:function () {
      this.emailLoginShow = true
      this.telLoginShow = false
      this.userNameLoginShow = false
    },
    showUserNameLogin:function () {
      this.userNameLoginShow = true
      this.telLoginShow = false
      this.emailLoginShow = false
    },
    submitForm(formName) {
      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/user/toLoginByUserName', this.ruleForm ).then(response => {
            if (response.data.message === 'success') {
              bus.$emit('changeMenu',true)
              that.$router.push('/White');
              that.$router.go(0)
            } else {
              that.$message.warning(response.data.message)
            }
          }).catch(
            )
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
