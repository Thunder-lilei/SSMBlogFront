<template>
  <div>
    <h1>邮箱登录</h1>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="邮箱" prop="mail">
        <el-input v-model="ruleForm.mail"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <el-input v-model="ruleForm.code">
          <template slot="append">
            <el-button @click="getCode" style="color: #005cc5" type="info" round>获取验证码</el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import bus from '../router/bus'

export default {
  name: 'EmailLogin',
  data() {
    return {
      ruleForm: {
        mail: '',
        code: '',
      },
      rules: {
        mail: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
        ]
      },
    }
  },
  methods: {
    getCode:function () {
      if (this.ruleForm.mail === '') {
        this.$message({
          showClose: true,
          message: "请填写邮箱！",
          type: 'warning'
        });
        return ;
      }
      const that = this
      let data = new URLSearchParams();
      data.append("mail", this.ruleForm.mail)
      this.$axios.post('/user/setMailCode', data).then(response => {
        if (response.data.message === 'success') {
          that.$message({
            showClose: true,
            message: "验证码发送成功！",
            type: 'success'
          });
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
    },
    submitForm(formName) {
      const that = this
      let data = new URLSearchParams();
      data.append("mail", this.ruleForm.mail)
      data.append("code", this.ruleForm.code)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/user/mailLogin', data).then(response => {
            if (response.data.message === 'success') {
              bus.$emit('changeMenu',true)
              that.$router.push('/');
              that.$router.go(0)
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
                message: '请求失败！',
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
