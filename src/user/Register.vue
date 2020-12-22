<template>
  <div>
    <el-alert v-show="ruleForm.userPassword !== ruleForm.userPasswordConfirm" title="两次密码不一致" type="error"></el-alert>

    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="头像链接" prop="userProfilePhoto">
        <el-input type="url" v-model="ruleForm.userProfilePhoto"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="ruleForm.userName"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="userNickname">
        <el-input v-model="ruleForm.userNickname"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="userPassword">
        <el-input v-model="ruleForm.userPassword" show-password></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="userPassword">
        <el-input v-model="ruleForm.userPasswordConfirm" show-password></el-input>
      </el-form-item>
      <el-form-item label="生日" prop="userBirthday">
        <el-input type="date" v-model="ruleForm.userBirthday"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="userEmail">
        <el-input type="email" v-model="ruleForm.userEmail"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="userTelephoneNumber">
        <el-input type="tel" v-model="ruleForm.userTelephoneNumber"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      ruleForm: {
        userName: '',
        userPassword: '',
        userPasswordConfirm: '',
        userProfilePhoto: '',
        userNickname: '',
        userBirthday: '',
        userEmail: '',
        userTelephoneNumber: '',
      },
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
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
  methods: {
    submitForm(formName) {
      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = new URLSearchParams();
          data.append('userName',  this.ruleForm.userName)
          data.append('userPassword',  this.ruleForm.userPassword)
          data.append('userNickname', this.ruleForm.userNickname)
          this.$axios.post('/user/registerUser', data).then(response => {
            if (response.data.message === 'success') {
              that.$message({
                showClose: true,
                message: '添加成功！',
                type: 'success'
              });
              that.$router.push('/Login');
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
  }
}
</script>

<style scoped>

</style>
