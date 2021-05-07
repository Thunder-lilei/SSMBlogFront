<template>
  <div>
    <div>
    <h1>用户管理</h1>
    <el-table
      v-loading="loadingData"
      :data="userList"
      class="tableBox"
      >
      <el-table-column
        type="index"
        label="序号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="userNickname"
        label="昵称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="userRole"
        label="身份"
        width="180">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.userRole === '1'">管理员</el-tag>
          <el-tag v-else-if="scope.row.userRole === '0'" type="info">用户</el-tag>
          <el-tag v-else type="danger">非法身份</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="right">
        <template slot="header" slot-scope="scope">
          <el-input
            @keyup.enter.native="selectUserBaseInfoByKey"
            v-model="keyValue"
            size="max"
            placeholder="输入关键字搜索"/>
        </template>
        <template slot-scope="scope">
          <el-button v-if="scope.row.userRole === '0'" @click="toUploadUser(scope.row.userId)" type="success" icon="el-icon-upload2" circle></el-button>
          <el-button v-else-if="scope.row.userRole === '1'" @click="toDownUser(scope.row.userId)" type="info" icon="el-icon-download" circle></el-button>
          <el-button @click="toUpdateUser(scope.row.userId)" type="primary" icon="el-icon-edit" circle></el-button>
          <el-popconfirm
            title="确定删除吗？"
            @confirm="deleteUser(scope.row.userId)"
          >
            <el-button slot="reference" type="danger" icon="el-icon-delete" circle></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <br/>
    <el-pagination
      @current-change="pageNowChange"
      @size-change="pageSizeChange"
      background
      layout="total, sizes, prev, pager, next"
      :page-sizes="[5, 10, 20, 30]"
      :page-size=pageSize
      :total=total>
    </el-pagination>
    </div>
    <div class="userInfoDiv">
      <UserInfo></UserInfo>
    </div>
  </div>
</template>

<script>
import UserInfo from '../user/UserInfo'
export default {
  name: 'UserControl',
  components: {UserInfo},
  data() {
    return {
      loadingData: true, //数据加载判定
      userList: [], //用户列表
      keyValue: '', //搜索关键词
      total: 0, //表格总数
      pageNow: 1, //当前页码
      pageSize: 10, //每页数量
    }
  },
  mounted () {
    this.selectAllUserBaseInfo(1, this.pageSize)
  },
  methods: {
    pageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.selectAllUserBaseInfo(1, pageSize)
    },
    pageNowChange:function(pageNow) {
      this.pageNow = pageNow
      this.selectAllUserBaseInfo(pageNow, this.pageSize)
    },
    toUploadUser:function (userId) {
      const that = this
      let param = {
        userId: userId,
      }
      this.$axios.post('/user/addAdmin', param).then(response => {
        if (response.data.message === 'success') {
          that.$message.success("成功任命管理员！")
          that.selectAllUserBaseInfo(that.pageNow, that.pageSize)
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    toDownUser:function (userId) {
      const that = this
      let param = {
        userId: userId,
      }
      this.$axios.post('/user/removeAdmin', param).then(response => {
        if (response.data.message === 'success') {
          that.$message.success("成功设置为用户！")
          that.selectAllUserBaseInfo(that.pageNow, that.pageSize)
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    toUpdateUser:function (userId) {
      const that = this
      let data = new URLSearchParams();
      data.append("updateUserId", userId)
      this.$axios.post('/user/setUpdateUser', data).then(response => {
        if (response.data.message === 'success') {
          this.$router.push('/UpdateUser');
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    deleteUser:function (userId) {
      const that = this
      let data = new URLSearchParams();
      data.append("userId", userId)
      this.$axios.post('/user/deleteUser', data).then(response => {
        if (response.data.message === 'success') {
          that.$message.success("移除成功！")
          that.selectAllUserBaseInfo(that.pageNow, that.pageSize)
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    selectAllUserBaseInfo:function (pageNow, pageSize) {
      const that = this
      that.loadingData = true
      let data = new URLSearchParams();
      data.append("pageNow", pageNow)
      data.append("pageSize", pageSize)
      this.$axios.post('/user/selectAllUserBaseInfo', data).then(response => {
        if (response.data.message === 'success') {
          that.userList = response.data.allUserPageInfo.list
          that.total = response.data.allUserPageInfo.total
          that.loadingData = false
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    selectUserBaseInfoByKey:function () {
      const that = this
      that.loadingData = true
      let data = new URLSearchParams();
      data.append("pageNow", this.pageNow)
      data.append("pageSize", this.pageSize)
      data.append("key", this.keyValue)
      this.$axios.post('/user/selectUserBaseInfoByKey', data).then(response => {
        if (response.data.message === 'success') {
          that.userList = response.data.userPageInfo.list
          that.total = response.data.userPageInfo.total
          that.loadingData = false
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
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
.userInfoDiv {
  position: fixed;
  top: 200px;
}
.tableBox {
  width: 100%;
  border-radius: 25px;
}
</style>
