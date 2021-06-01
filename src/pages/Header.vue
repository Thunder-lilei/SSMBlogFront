<template>
  <div>
    <div v-show="logoutShow" class="demo-fit" style="margin: 30% 65% 20px 0;width: 100%">
      <div class="headImgBox">
<!--        <el-popover-->
<!--          placement="right"-->
<!--          width="220"-->
<!--          trigger="click">-->
<!--          <div style="display: flex;">-->
<!--            <div>-->
<!--              <el-button @click="changeImgBySrc" type="primary" plain>在线地址</el-button>-->
<!--            </div>-->
<!--            <div v-for="(item, index) in headImgList">-->
<!--              <img @click="changeHeadImg(item.src)" class="imgSelect" :src="item.src">-->
<!--            </div>-->
<!--          </div>-->
<!--          <img slot="reference" class="headImg" :src="userInfo.userProfilePhoto">-->
<!--        </el-popover>-->
        <img @click="dialogVisible = true" class="headImg" :src="userInfo.userProfilePhoto">
      </div>
      <el-dialog
        title="更换头像"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
          <span slot="footer" class="dialog-footer">
            <div style="display: flex;">
              <el-input
                placeholder="请输入头像地址"
                v-model="newHeadImgSrc"
                clearable>
              </el-input>
              <el-button type="primary" @click="changeHeadImg(newHeadImgSrc)">确 定</el-button>
            </div>

            <div style="display: flex;margin-top: 20px;">
              <p>系统头像：</p>
              <div v-for="(item, index) in headImgList">
                  <img class="imgSelect" @click="changeHeadImg(item.src)" :src="item.src">
              </div>
            </div>
          </span>
      </el-dialog>
      <div v-show="logoutShow">
        <h2 style="font-size: 20px;margin-left: 5%;color: black">当前用户：</h2>
        <h2 style="font-size: 20px;margin-left: 5%;color: aliceblue">{{ userInfo.userNickname }}</h2>
      </div>
      <div v-show="logoutShow">
        <router-link to='/UpdateUser'>
          <el-button type="primary" round>修改信息</el-button>
        </router-link>
        <br/><br/>
        <el-button @click="logout" type="danger" round>登出</el-button>
        <br/><br/>
        <router-link to='/White'>
          <el-button round style="">主页</el-button>
        </router-link>
      </div>
    </div>
    <div style="margin: 30% 65% 5% 0" v-show="!logoutShow">
      <router-link to='/Login'>
        <el-button type="primary" round>登录</el-button>
      </router-link>
      <br/><br/>
      <router-link to='/Register'>
        <el-button type="primary" round>注册</el-button>
      </router-link>
      <br/><br/>
      <router-link to='/White'>
        <el-button round style="">主页</el-button>
      </router-link>
    </div>
  </div>
</template>

<script>
import bus from '../router/bus'
export default {
  name: 'Header',
  data() {
    return {
      dialogVisible: false, //更换头像dialog
      newHeadImgSrc: '', //新头像地址
      headImgList: [ //头像数组
        {src: 'static/headImg/hammer.jpg'},
        {src: 'static/headImg/paiDaXing.jpg'},
      ],
      userInfo: {
        userNickname: '',
        userProfilePhoto: '',
      },
      logoutShow: false,
    }
  },
  mounted () {
    this.getLoginUser()
    bus.$on("changeLoginUserInfo",(message)=>{
      this.userInfo.userNickname = message.userNickname
      this.userInfo.userProfilePhoto = message.userProfilePhoto
    })
  },
  methods: {
    getLoginUser:function () {
      const that = this
      this.$axios.post('/user/getLoginUser').then(response => {
        if (response.data.message === 'success') {
          that.userInfo.userNickname = response.data.loginUser.userNickname
          that.userInfo.userProfilePhoto = response.data.loginUser.userProfilePhoto
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
    logout:function () {
      const that = this
      this.$axios.post('/user/logout').then(response => {
        if (response.data.message === 'success') {
          that.logoutShow = false
          that.userInfo = ''
          that.$router.push('/White');
          that.$router.go(0)
        } else {
          that.$message({
            showClose: true,
            message: '请登录！',
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
    changeHeadImg(src) {
        if (src === '' && this.newHeadImgSrc === '') {
          this.$message.warning("尚未选择头像！")
          return
        }
        const that = this
        let data = new URLSearchParams();
        data.append("imgUrl", src)
        this.$axios.post('/user/changeHeadImg', data).then(response => {
          if (response.data.message === 'success') {
            that.$message.success("变更成功！")
            that.dialogVisible = false
            that.newHeadImgSrc = ''
            that.getLoginUser()
          } else {
            that.$message.warning(response.data.message)
          }
        }).catch(
          function (error) {
            that.$message.error(error)
          })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
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
.headImgBox {
  margin-left: 20%;
  width: 100px;
  height: 100px;
}
.headImgBox .headImg {
  width: 100%;
  height: 100%;
  border-radius: 25px;
}
.imgSelect {
  width: 50px;
  height: 50px;
  margin-left: 5px;
  border:1px solid green;
  /*border-radius: 25px;*/
}
</style>
