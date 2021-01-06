<template>
<div style="height: 925px;margin: 0 0 0 10%">
  <Header></Header>
  <div>
    <el-radio-group v-model="isCollapse" :style="iconStyle">
      <el-button @click="labelControl" type="primary" icon="el-icon-menu" circle></el-button>
    </el-radio-group>
    <el-menu v-show="isCollapse" :style="menuStyle" default-active="1-4-1" class="el-menu-vertical-demo" :collapse="true">
      <router-link to='/UserControl'>
        <el-menu-item index="1">
            <i class="el-icon-user"></i>
          <span slot="title">用户管理</span>
        </el-menu-item>
      </router-link>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-user-solid"></i>
          <span slot="title">好友</span>
        </template>
        <el-menu-item-group>
          <el-button type="success" icon="el-icon-plus" circle></el-button>
          <el-table
            :data="userFriendList"
            style="width: 100%">
            <el-table-column
              type="index"
              label="序号"
              width="90">
            </el-table-column>
            <el-table-column
              prop="userNickname"
              label="昵称"
              width="90">
            </el-table-column>
            <el-table-column
              align="right"
              width="150"
            >
              <template slot="header" slot-scope="scope">
                <el-input
                  @keyup.enter.native=""
                  v-model="keyValue"
                  size="max"
                  placeholder="输入关键字搜索"/>
              </template>
              <template slot-scope="scope">
                <el-button @click="" type="primary" icon="el-icon-edit" circle></el-button>
                <el-popconfirm
                  title="确定删除吗？"
                  @confirm=""
                >
                  <el-button slot="reference" type="danger" icon="el-icon-delete" circle></el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-menu-item-group>
      </el-submenu>
      <router-link to='/ArticleControl'>
        <el-menu-item index="3">
          <i class="el-icon-tickets"></i>
          <span slot="title">博文</span>
        </el-menu-item>
      </router-link>
    </el-menu>
  </div>
</div>
</template>

<script>
import Header from './Header'
import bus from '../router/bus'
export default {
  name: 'NavMenu',
  components: {Header},
  data() {
    return {
      isCollapse: false,
      menuStyle: 'width: 35%;',
      iconStyle: 'margin: 0 60% 10% 0',
      userFriendList: [],
      keyValue: '',
      total: 0,
      pageNow: 1,
      pageSize: 10,
    };
  },
  mounted () {
    this.getLoginUser()
    this.getUserFriend()
  },
  methods: {
    getUserFriend:function () {
      const that = this
      let data = new URLSearchParams();
      data.append("pageNow", this.pageNow)
      data.append("pageSize", this.pageSize)
      this.$axios.post('/userFriend/getMyFriend', data).then(response => {
        if (response.data.message === 'success') {
          that.userFriendList = response.data.userPageInfo.list
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
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
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
