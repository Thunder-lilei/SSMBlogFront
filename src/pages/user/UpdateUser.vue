<template>
  <div class="bodyBox">

        <el-form :model="loginUser" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item class="inputText" label="ID" prop="userId">
            <div class="tagBox">
              <div class="tagText">
                {{ loginUser.userId }}
              </div>
            </div>
          </el-form-item>
          <el-form-item class="inputText" label="用户名" prop="userName">
            <el-input v-model="loginUser.userName" @blur="checkUserName"></el-input>
            <el-alert v-show="ifHaveSameUserName !== ''" title="" type="error">{{ ifHaveSameUserName }}</el-alert>
          </el-form-item>
          <el-form-item class="inputText" label="昵称" prop="userNickname">
            <el-input v-model="loginUser.userNickname"></el-input>
          </el-form-item>
          <el-form-item class="inputText" label="密码" prop="userPassword">
            <el-input v-model="loginUser.userPassword" show-password></el-input>
          </el-form-item>
          <el-form-item class="inputText" label="确认密码" prop="userPassword">
            <el-input v-model="userPasswordConfirm" show-password></el-input>
            <el-alert class="waringText" v-show="loginUser.userPassword !== userPasswordConfirm" title="两次密码不一致" type="error"></el-alert>
          </el-form-item>
          <el-form-item class="birthdayInput inputText" label="生日" prop="userBirthday">
            <el-date-picker
              v-model="loginUser.userBirthday"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item class="inputText" label="邮箱" prop="userEmail">
            <el-input type="email" v-model="loginUser.userEmail" @blur="checkEmail"></el-input>
            <el-alert class="waringText" v-show="ifHaveSameEmail !== ''" title="" type="error">{{ ifHaveSameEmail }}</el-alert>
          </el-form-item>
          <el-form-item class="inputText" label="电话" prop="userTelephoneNumber">
            <el-input type="tel" v-model="loginUser.userTelephoneNumber" @blur="checkTel"></el-input>
            <el-alert class="waringText" v-show="ifHaveSameTel !== ''" title="" type="error">{{ ifHaveSameTel }}</el-alert>
          </el-form-item>
          <el-form-item>
            <el-button v-show="ifHaveSameUserName === '' && ifHaveSameEmail === '' && ifHaveSameTel === ''" type="primary" @click="submitForm('ruleForm')">确认修改</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
  </div>
</template>

<script>
import Footer from '../Footer'
import Header from '../Header'
import NavMenu from '../NavMenu'
import bus from '../../router/bus'
export default {
  name: 'UpdateUser',
  components: {Header ,NavMenu},
  data() {
    return {
      loginUser: {},
      userPasswordConfirm: '',
      updateUserId: '',
      isUpdateUser: false,
      ifHaveSameUserName: '',
      ifHaveSameEmail: '',
      ifHaveSameTel: '',
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
    checkUserName:function () {
      let data = new URLSearchParams();
      data.append("userName", this.loginUser.userName)
      data.append("userId", this.loginUser.userId)
      this.ifHaveSame(data , (callbackData) => {
        if (callbackData === true) {
          this.ifHaveSameUserName = "用户名重复，请更改用户名！"
        } else {
          this.ifHaveSameUserName = ''
        }
      })
    },
    checkEmail:function () {
      let data = new URLSearchParams();
      data.append("email", this.loginUser.userEmail)
      data.append("userId", this.loginUser.userId)
      this.ifHaveSame(data , (callbackData) => {
        if (callbackData === true) {
          this.ifHaveSameEmail = "邮箱重复绑定，请更换邮箱！"
        } else {
          this.ifHaveSameEmail = ''
        }
      })
    },
    checkTel:function () {
      let data = new URLSearchParams();
      data.append("tel", this.loginUser.userTelephoneNumber)
      data.append("userId", this.loginUser.userId)
      this.ifHaveSame(data , (callbackData) => {
        if (callbackData === true) {
          this.ifHaveSameTel = "电话重复绑定，请更换电话！"
        } else {
          this.ifHaveSameTel = ''
        }
      })
    },
    ifHaveSame(data, callback) {
      const that = this
      this.$axios.post('/user/ifHaveSame', data).then(response => {
        if (response.data.message === true) {
          callback(response.data.message)
        } else {
          callback(response.data.message)
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
                bus.$emit('changeLoginUserInfo',that.loginUser)
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
.bodyBox {
  width: 60%;
}
.birthdayInput {
  margin-right: 50%;
}
.tagBox {
  background-color: #fdf6ec ;
  width: 10%;
  border-radius: 20px;
}
.tagText {
  color: #3e76f6;
  line-height: 40px;
  height: 40px;
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
