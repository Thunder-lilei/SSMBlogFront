<template>
  <div>
    <h1>用户管理</h1>
    <el-table
      :data="userList"
      style="width: 100%">
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
        align="right">
        <template slot="header" slot-scope="scope">
          <el-input
            @keyup.enter.native="selectUserBaseInfoByKey"
            v-model="keyValue"
            size="max"
            placeholder="输入关键字搜索"/>
        </template>
        <template slot-scope="scope">
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
</template>

<script>
export default {
  name: 'UserControl',
  data() {
    return {
      userList: [],
      keyValue: '',
      total: 0,
      pageNow: 1,
      pageSize: 10,
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
    toUpdateUser:function (userId) {
      const that = this
      let data = new URLSearchParams();
      data.append("updateUserId", userId)
      this.$axios.post('/user/setUpdateUser', data).then(response => {
        if (response.data.message === 'success') {
          this.$router.push('/UpdateUser');
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
    deleteUser:function (userId) {
      const that = this
      let data = new URLSearchParams();
      data.append("userId", userId)
      this.$axios.post('/user/deleteUser', data).then(response => {
        if (response.data.message === 'success') {
          that.$message({
            showClose: true,
            message: "成功移除",
            type: 'success'
          });
          that.selectAllUserBaseInfo(that.pageNow, that.pageSize)
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
    selectAllUserBaseInfo:function (pageNow, pageSize) {
      const that = this
      let data = new URLSearchParams();
      data.append("pageNow", pageNow)
      data.append("pageSize", pageSize)
      this.$axios.post('/user/selectAllUserBaseInfo', data).then(response => {
        if (response.data.message === 'success') {
          that.userList = response.data.allUserPageInfo.list
          that.total = response.data.allUserPageInfo.total
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
    selectUserBaseInfoByKey:function () {
      const that = this
      let data = new URLSearchParams();
      data.append("pageNow", this.pageNow)
      data.append("pageSize", this.pageSize)
      data.append("key", this.keyValue)
      this.$axios.post('/user/selectUserBaseInfoByKey', data).then(response => {
        if (response.data.message === 'success') {
          that.userList = response.data.userPageInfo.list
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
