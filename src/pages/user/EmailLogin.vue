<template>
  <div>
    <h1>邮箱登录</h1>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm formBox">
      <el-form-item label="邮箱" prop="mail">
        <el-input v-model="ruleForm.mail"></el-input>
      </el-form-item>
      <el-form-item v-if="!isCodeLogin" label="密码" prop="password">
        <el-input v-model="ruleForm.password" show-password></el-input>
      </el-form-item>
      <el-form-item v-if="isCodeLogin" label="验证码" prop="code">
        <el-input v-model="ruleForm.code">
          <template slot="append">
            <el-button v-if="showGetCode" v-loading="isGetCode" @click="getCode" style="color: #005cc5" type="info" round>
              获取验证码</el-button>
            <el-button v-if="!showGetCode" style="color: #005cc5" type="info" round>
              {{ countDown }}</el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        <el-button v-if="!isCodeLogin" type="primary" @click="isCodeLogin = true">验证码登录</el-button>
        <el-button v-if="isCodeLogin" type="primary" @click="isCodeLogin = false">密码登录</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import bus from '../../router/bus'

export default {
  name: 'EmailLogin',
  data() {
    return {
      isGetCode: false, //是否正在获取验证码
      ruleForm: {
        mail: '',
        code: '',
        password: '',
      },
      rules: {
        mail: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
        ]
      },
      isCodeLogin: false, //是否是验证码登录
      showGetCode: true, //是否允许获取验证码
      countDown: '', //获取验证码倒计时
    }
  },
  methods: {
    getCode:function () {
      if (this.ruleForm.mail === '') {
        this.$message.warning("请填写邮箱！")
        return ;
      }
      const that = this
      that.isGetCode = true
      let data = new URLSearchParams();
      data.append("mail", this.ruleForm.mail)
      this.$axios.post('/user/setMailCode', data).then(response => {
        if (response.data.message === 'success') {
          that.isGetCode = false
          that.$message.success("验证码发送成功！")
          that.showGetCode = false

          let i = 30;
          let timer = setInterval(() => {
            this.countDown = i + 's';
            i--;
            if (i < 0) {
              that.showGetCode = true
              clearInterval(timer);
            }
          }, 1000);

        } else {
          that.isGetCode = false
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    submitForm(formName) {
      const that = this
      let param = {
        password: this.ruleForm.password,
        mail: this.ruleForm.mail,
        code: this.ruleForm.code,
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/user/mailLogin', param).then(response => {
            if (response.data.message === 'success') {
              bus.$emit('changeMenu',true)
              that.$router.push('/White');
              that.$router.go(0)
            } else {
              that.$message.warning(response.data.message)
            }
          }).catch(
            function (error) {
              that.$message.error(error)
            })
        } else {
          this.$message.warning("请检查格式！")
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
.formBox {
  width: 50%;
  margin: 0 auto;
}
</style>
