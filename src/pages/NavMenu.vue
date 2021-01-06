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
          <el-collapse>
            <el-collapse-item style="margin: 0 0 0 3%" title="添加好友" name="1">
              <el-input
                @keyup.enter.native="selectUserBaseInfoByKey"
                v-model="keyValue"
                size="max"
                style="width: 50%;margin: 0 0 0 25%"
                placeholder="输入关键字搜索"/>
              <el-table
                :data="addUserList"
                style="width: 100%">
                <el-table-column
                  prop="userNickname"
                  label="昵称"
                  width="140">
                </el-table-column>
                <el-table-column
                  align="right"
                  width="150"
                >
                <template slot-scope="scope">
                  <el-button @click="" type="primary" icon="el-icon-plus" circle></el-button>
                </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
          <el-table
            :data="userFriendList"
            style="width: 100%">
            <el-table-column
              prop="userNickname"
              label="昵称"
              width="140">
            </el-table-column>
            <el-table-column
              align="right"
              width="150"
            >
              <template slot="header" slot-scope="scope">
                <el-input
                  @keyup.enter.native="selectUserFriendBaseInfoByKey"
                  v-model="keyValue"
                  size="max"
                  placeholder="输入关键字搜索"/>
              </template>
              <template slot-scope="scope">
                <el-popconfirm
                  title="确定删除吗？"
                  @confirm=""
                >
                <el-button slot="reference" type="danger" icon="el-icon-delete" circle></el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
          <br/>
          <el-pagination
            @current-change=""
            @size-change=""
            background
            layout="total, sizes, prev, pager, next"
            :page-sizes="[5, 10, 20, 30]"
            :page-size=pageSize
            :total=total>
          </el-pagination>
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
      addUserList: [],
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
    selectUserBaseInfoByKey:function () {
      const that = this
      let data = new URLSearchParams();
      data.append("pageNow", this.pageNow)
      data.append("pageSize", this.pageSize)
      data.append("key", this.keyValue)
      this.$axios.post('/user/selectUserBaseInfoByKeyWithoutMine', data).then(response => {
        if (response.data.message === 'success') {
          that.addUserList = response.data.userPageInfo.list
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
    selectUserFriendBaseInfoByKey:function () {
      const that = this
      let data = new URLSearchParams();
      data.append("pageNow", this.pageNow)
      data.append("pageSize", this.pageSize)
      data.append("key", this.keyValue)
      this.$axios.post('/userFriend/getMyFriendByKey', data).then(response => {
        if (response.data.message === 'success') {
          that.userFriendList = response.data.userPageInfo.list
          that.total = response.data.userPageInfo.total
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
    getUserFriend:function () {
      const that = this
      let data = new URLSearchParams();
      data.append("pageNow", this.pageNow)
      data.append("pageSize", this.pageSize)
      this.$axios.post('/userFriend/getMyFriend', data).then(response => {
        if (response.data.message === 'success') {
          that.userFriendList = response.data.userPageInfo.list
          that.total = response.data.userPageInfo.total
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
