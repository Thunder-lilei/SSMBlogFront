<template>
<div style="height: 925px;margin: 0 0 0 10%">
  <Header></Header>
  <div>
    <el-radio-group v-model="isCollapse" :style="iconStyle">
      <el-button @click="labelControl" type="primary" icon="el-icon-menu" circle></el-button>
    </el-radio-group>
    <el-menu v-show="isCollapse" :style="menuStyle" default-active="1-4-1" class="el-menu-vertical-demo" :collapse="true">
      <router-link v-show="ifAdminResult" to='/UserControl'>
        <el-menu-item index="1">
          <i class="el-icon-user"></i>
          <span slot="title">用户管理</span>
        </el-menu-item>
      </router-link>
      <router-link to='/ArticleControl'>
        <el-menu-item index="2">
          <i class="el-icon-tickets"></i>
          <span slot="title">博文</span>
        </el-menu-item>
      </router-link>
      <router-link to='/DraftControl'>
        <el-menu-item index="3">
          <i class="el-icon-document"></i>
          <span slot="title">草稿</span>
        </el-menu-item>
      </router-link>
      <Friend></Friend>
      <router-link to='/SortLabel'>
        <el-menu-item index="5">
          <i class="el-icon-folder"></i>
          <span slot="title">归档</span>
        </el-menu-item>
      </router-link>
      <router-link to='/Square'>
        <el-menu-item index="6">
          <i class="el-icon-orange"></i>
          <span slot="title">广场</span>
        </el-menu-item>
      </router-link>
    </el-menu>
  </div>
</div>
</template>

<script>
import Header from './Header'
import Friend from './Friend/Friend'
import Square from './article/Square'
export default {
  name: 'NavMenu',
  components: {Square, Friend, Header},
  data() {
    return {
      isCollapse: false,
      menuStyle: 'width: 35%;',
      iconStyle: 'margin: 0 60% 10% 0',
      userFriendList: [],
      addUserList: [],
      keyValue: '',
      total: 0,
      pageNow: 1,
      pageSize: 10,
      ifAdminResult: false,
    };
  },
  mounted () {
    this.getLoginUser()
    this.ifAdmin()
  },
  methods: {
    ifAdmin:function () {
      const that = this
      this.$axios.post('/user/ifAdmin').then(response => {
        if (response.data.message === 'success') {
          that.ifAdminResult = response.data.result
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
    getLoginUser:function () {
      const that = this
      this.$axios.post('/user/getLoginUser').then(response => {
        if (response.data.message === 'success') {
          that.iconStyle = 'margin: 0 0 10% 0'
          that.menuStyle = 'width: 40%;margin: 0 0 0 30%;'
        } else {
          that.iconStyle = 'margin: 0 60% 10% 0'
          that.menuStyle = 'width: 40%;'
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
    labelControl() {
      this.isCollapse = !this.isCollapse
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
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
