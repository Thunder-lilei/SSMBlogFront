<template>
  <div>
    <el-popover
      placement="right"
      width="300"
      trigger="click">
      <el-button slot="reference" icon="el-icon-user-solid"></el-button>
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
              style="width: 100%"
              max-height="300"
            >
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
                  <el-button @click="addFriend(scope.row.userId)" type="primary" icon="el-icon-plus" circle></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
        <el-table
          :data="userFriendList"
          style="width: 100%"
          max-height="500"
        >
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
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'Friend',
  data() {
    return {
      userFriendList: [],
      addUserList: [],
      keyValue: '',
      total: 0,
      pageNow: 1,
      pageSize: 10,
    };
  },
  mounted () {
    this.getUserFriend()
  },
  methods: {
    addFriend:function (userId) {
      const that = this
      let data = new URLSearchParams();
      data.append("userId", userId)
      this.$axios.post('/userFriend/addFriend', data).then(response => {
        if (response.data.message === 'success') {
          that.$message({
            showClose: true,
            message: '添加成功！',
            type: 'success'
          });
          that.getUserFriend()
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
      this.$axios.post('/user/selectUserBaseInfoByKeyWithoutMineList', data).then(response => {
        if (response.data.message === 'success') {
          that.addUserList = response.data.userList
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
      this.$axios.post('/userFriend/getMyFriendByKeyList', data).then(response => {
        if (response.data.message === 'success') {
          that.userFriendList = response.data.userList
          that.total = response.data.userList
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
      this.$axios.post('/userFriend/getMyFriendList', data).then(response => {
        if (response.data.message === 'success') {
          that.userFriendList = response.data.userList
          that.total = response.data.userList
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
}
</script>

<style scoped>

</style>
