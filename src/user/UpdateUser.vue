<template>
  <div>
        <el-alert style="width: 50%;margin: auto;" v-show="userForm.userPassword !== userForm.userPasswordConfirm" title="两次密码不一致" type="error"></el-alert>

        <el-form style="width: 50%;margin: auto;" :model="userForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="头像链接" prop="userProfilePhoto">
            <el-input type="url" v-model="userForm.userProfilePhoto"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="userForm.userName"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="userNickname">
            <el-input v-model="userForm.userNickname"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="userPassword">
            <el-input v-model="userForm.userPassword" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="userPassword">
            <el-input v-model="userForm.userPasswordConfirm" show-password></el-input>
          </el-form-item>
          <el-form-item label="生日" prop="userBirthday">
            <el-input type="date" v-model="userForm.userBirthday"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="userEmail">
            <el-input type="email" v-model="userForm.userEmail"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="userTelephoneNumber">
            <el-input type="tel" v-model="userForm.userTelephoneNumber"></el-input>
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
      userForm: {
        userId: '',
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
  mounted () {
    this.getLoginUser()
  },
  methods: {
    getLoginUser() {
      const that = this
      this.$axios.post('/user/getLoginUser').then(response => {
        if (response.data.message === 'success') {
          that.userForm.userId = response.data.loginUser.userId
          that.userForm.userNickname = response.data.loginUser.userNickname
          that.userForm.userProfilePhoto = response.data.loginUser.userProfilePhoto
          that.userForm.userName = response.data.loginUser.userName
          that.userForm.userPassword = response.data.loginUser.userPassword
          that.userForm.userPasswordConfirm = response.data.loginUser.userPassword
          that.userForm.userBirthday = response.data.loginUser.userBirthday
          that.userForm.userEmail = response.data.loginUser.userEmail
          that.userForm.userTelephoneNumber = response.data.loginUser.userTelephoneNumber
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
    submitForm(formName) {
      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = new URLSearchParams();
          data.append('userId', this.userForm.userId)
          data.append('userName', this.userForm.userName)
          data.append('userPassword', this.userForm.userPassword)
          data.append('userNickname', this.userForm.userNickname)
          data.append('userBirthday', this.userForm.userBirthday)
          data.append('userEmail', this.userForm.userEmail)
          data.append('userTelephoneNumber', this.userForm.userTelephoneNumber)
          data.append('userProfilePhoto', this.userForm.userProfilePhoto)
          this.$axios.post('/user/updateUser', data).then(response => {
            if (response.data.message === 'success') {
              that.$message({
                showClose: true,
                message: '修改完成！',
                type: 'success'
              });
              bus .$emit('userForm',that.userForm)
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
