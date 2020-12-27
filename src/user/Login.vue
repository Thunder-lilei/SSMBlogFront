<template>
  <div>
    <el-form style="width: 50%;margin: auto;" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="ruleForm.userName"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="userPassword">
        <el-input v-model="ruleForm.userPassword" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <Footer></Footer>
  </div>
</template>

<script>
import Footer from '../pages/Footer'
export default {
  name: 'Login',
  components: {Footer},
  data() {
    return {
      ruleForm: {
        userName: '',
        userPassword: '',
      },
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        userPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = new URLSearchParams();
          data.append('userName',  this.ruleForm.userName)
          data.append('userPassword',  this.ruleForm.userPassword)
          this.$axios.post('/user/toLoginByUserName', data).then(response => {
            if (response.data.message === 'success') {
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
