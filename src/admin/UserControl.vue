<template>
  <div>
    <h1>用户管理</h1>
    <el-table
      :data="userList"
      style="width: 100%">
      <el-table-column
        prop="userId"
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
          <el-button type="primary" icon="el-icon-edit" circle></el-button>
          <el-button type="danger" icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'UserControl',
  data() {
    return {
      userList: [],
      keyValue: '',
    }
  },
  mounted () {
      const that = this
      let data = new URLSearchParams();
      data.append("pageNow", "1")
      data.append("pageSize", "10")
      this.$axios.post('/user/selectAllUserBaseInfo', data).then(response => {
        if (response.data.message === 'success') {
          that.userList = response.data.allUserPageInfo.list
          console.log(that.userList)
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
  methods: {
    selectUserBaseInfoByKey:function () {
      const that = this
      let data = new URLSearchParams();
      data.append("pageNow", "1")
      data.append("pageSize", "10")
      data.append("key", this.keyValue)
      this.$axios.post('/user/selectUserBaseInfoByKey', data).then(response => {
        if (response.data.message === 'success') {
          that.userList = response.data.userPageInfo.list
          console.log(that.userList)
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
