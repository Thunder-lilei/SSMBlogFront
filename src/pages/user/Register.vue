<template>
  <div class="bodyBox">

        <el-form :model="userForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item class="inputText" label="头像链接" prop="userProfilePhoto">
            <el-input type="url" v-model="userForm.userProfilePhoto"></el-input>
          </el-form-item>
          <el-form-item class="inputText" label="用户名" prop="userName">
            <el-input v-model="userForm.userName"></el-input>
          </el-form-item>
          <el-form-item class="inputText" label="昵称" prop="userNickname">
            <el-input v-model="userForm.userNickname"></el-input>
          </el-form-item>
          <el-form-item class="inputText" label="密码" prop="userPassword">
            <el-input v-model="userForm.userPassword" show-password></el-input>
          </el-form-item>
          <el-form-item class="inputText" label="确认密码" prop="userPassword">
            <el-input v-model="userForm.userPasswordConfirm" show-password></el-input>
            <el-alert class="waringText" v-show="userForm.userPassword !== userForm.userPasswordConfirm" title="两次密码不一致" type="error"></el-alert>
          </el-form-item>
          <el-form-item class="birthdayInput inputText" label="生日" prop="userBirthday">
            <el-date-picker
              v-model="userForm.userBirthday"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item class="inputText" label="邮箱" prop="userEmail">
            <el-input type="email" v-model="userForm.userEmail"></el-input>
          </el-form-item>
          <el-form-item class="inputText" label="电话" prop="userTelephoneNumber">
            <el-input type="tel" v-model="userForm.userTelephoneNumber"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">注册</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
  </div>
</template>

<script>
import Footer from '../Footer'
import NavMenu from '../NavMenu'
import Header from '../Header'
export default {
  name: 'Register',
  components: {NavMenu, Header},
  data() {
    return {
      userForm: {
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
  methods: {
    submitForm (formName) {
      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/user/registerUser', this.userForm).then(response => {
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
    resetForm (formName) {
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
.bodyBox {
  width: 60%;
}
.birthdayInput {
  margin-right: 50%;
}
.waringText {
  height: 40px;
}
</style>
<style>
.inputText .el-form-item__label {
  color: white;
}
</style>
