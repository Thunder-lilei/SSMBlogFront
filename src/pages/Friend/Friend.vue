<template>
  <div>
    <el-popover
      placement="right"
      width="300"
      trigger="click">
      <el-button slot="reference" icon="el-icon-user-solid"></el-button>
        <el-collapse>
          <el-collapse-item style="margin: 0 0 0 3%" title="添加关注" name="1">
            <el-input
              @keyup.enter.native="selectUserBaseInfoByKey"
              v-model="keyValue"
              size="max"
              style="width: 50%;margin: 0 0 0 25%"
              placeholder="输入关键字搜索"/>
            <el-table
              v-loading="loadingAddData"
              :data="addUserList"
              style="width: 100%"
              max-height="300"
            >
              <el-table-column
                label="头像"
                width="50">
                <template slot-scope="scope">
                  <el-avatar :src="scope.row.userProfilePhoto"></el-avatar>
                </template>
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
                <template slot-scope="scope">
                  <el-button @click="addFriend(scope.row.userId)" type="primary" icon="el-icon-plus" circle></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
        <el-table
          v-loading="loadingData"
          :data="userFriendList"
          style="width: 100%"
          max-height="500"
        >
          <el-table-column
            label="头像"
            width="50">
            <template slot-scope="scope">
              <el-avatar :src="scope.row.userProfilePhoto"></el-avatar>
            </template>
          </el-table-column>
          <el-table-column
            width="130">
            <template slot-scope="props">
              <el-link style="margin: 0 2% 0 0" @click="toShowUser(props.row.userId)">{{ props.row.userNickname }}</el-link><el-link @click="changeFriendNickname(props.row.userId)"><i class="el-icon-edit"></i></el-link>
            </template>
          </el-table-column>
          <el-table-column
            align="right"
            width="110"
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
                @confirm="deleteFriend(scope.row.userId)"
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
      loadingAddData: false,//关注数据加载判断
      loadingData: true, //添加关注数据加载判断
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
    changeFriendNickname:function (userId) {
      this.$prompt('请输入用户昵称！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        if (value === null) {value = ''}
        this.updateUserFriendNickname(userId, value)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    updateUserFriendNickname:function (userFriendId, nickName) {
      const that = this
      let data = new URLSearchParams();
      data.append("userFriendId", userFriendId)
      data.append("nickName", nickName)
      this.$axios.post('/userFriend/updateFriendNickName', data).then(response => {
        if (response.data.message === 'success') {
          that.$message.success("添加备注成功！")
          that.getUserFriend()
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    deleteFriend:function (userId) {
      const that = this
      let data = new URLSearchParams();
      data.append("userFriendId", userId)
      this.$axios.post('/userFriend/deleteFriend', data).then(response => {
        if (response.data.message === 'success') {
          that.$message.success("成功移除！")
          that.getUserFriend()
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    addFriend:function (userId) {
      const that = this
      let data = new URLSearchParams();
      data.append("userId", userId)
      this.$axios.post('/userFriend/addFriend', data).then(response => {
        if (response.data.message === 'success') {
          that.$message.success("成功添加！")
          that.getUserFriend()
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
      that.loadingAddData = true
      let data = new URLSearchParams();
      data.append("pageNow", this.pageNow)
      data.append("pageSize", this.pageSize)
      data.append("key", this.keyValue)
      this.$axios.post('/user/selectUserBaseInfoByKeyWithoutMineList', data).then(response => {
        if (response.data.message === 'success') {
          that.addUserList = response.data.userList
          that.loadingAddData = false
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    selectUserFriendBaseInfoByKey:function () {
      const that = this
      that.loadingData = true
      let data = new URLSearchParams();
      data.append("pageNow", this.pageNow)
      data.append("pageSize", this.pageSize)
      data.append("key", this.keyValue)
      this.$axios.post('/userFriend/getMyFriendByKeyList', data).then(response => {
        if (response.data.message === 'success') {
          that.userFriendList = response.data.userList
          that.loadingData = false
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    getUserFriend:function () {
      const that = this
      that.loadingData = true
      let data = new URLSearchParams();
      data.append("pageNow", this.pageNow)
      data.append("pageSize", this.pageSize)
      this.$axios.post('/userFriend/getMyFriendList', data).then(response => {
        if (response.data.message === 'success') {
          that.userFriendList = response.data.userList
          that.total = response.data.userList
          that.loadingData = false
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    toShowUser:function (userId) {
      this.$router.push({name:'ArticleControlBus', params: {articleUserId: userId}});
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
