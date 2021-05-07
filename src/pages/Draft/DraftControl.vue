<template>
  <div>
    <div>
    <h1>草稿</h1>
    <div class="tagBox">
      <div class="tagTextLeft">
        {{ tagText }}
      </div>
      <div class="tagTextRight">
        {{ surplusDraftCount }}
      </div>
    </div>
    <el-table
      v-loading="loadingData"
      :data="draftList"
      class="tableBox"
      >
      <el-table-column
        type="index"
        label="序号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="articleTitle"
        label="标题"
        width="180"
      >
      </el-table-column>
      <el-table-column
        align="right">
        <template slot-scope="scope">
          <el-button @click="toUploadDraft(scope.row.draftId)" type="success" icon="el-icon-upload2" circle></el-button>
          <el-button @click="toUpdateDraft(scope.row.draftId)" type="primary" icon="el-icon-edit" circle></el-button>
          <el-popconfirm
            title="确定删除吗？"
            @confirm="deleteDraft(scope.row.draftId)"
          >
            <el-button slot="reference" type="danger" icon="el-icon-delete" circle></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <div class="userInfoDiv">
      <UserInfo></UserInfo>
    </div>
  </div>
</template>

<script>
import UserInfo from '../user/UserInfo'
export default {
  name: 'DraftControl',
  components: {UserInfo},
  data() {
    return {
      tagText: '剩余可添加的草稿数量为：', //提示信息文本内容
      surplusDraftCount: '', //剩余可添加草稿数量
      loadingData: true, //数据加载判断
      draftList: [], //草稿列表
    }
  },
  created () {
    this.getDraftList()
  },
  methods: {
    getSurplusDraftCount() {
      let that = this
      this.$axios.post('/draft/getSurplusDraftCount').then(response => {
        if (response.data.message === 'success') {
          that.surplusDraftCount = response.data.surplusDraftCount
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    toUploadDraft(draftId) {
      let that = this
      let param = {
        draftId : draftId,
      }
      this.$axios.post('/draft/uploadDraft', param).then(response => {
        if (response.data.message === 'success') {
          that.$message.success("发布成功！")
          that.getDraftList()
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    toUpdateDraft(draftId) {
      let that = this
      let param = {
        draftId : draftId,
      }
      this.$axios.post('/draft/setShowDraft', param).then(response => {
        if (response.data.message === 'success') {
          this.$router.push('/Article');
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    deleteDraft(draftId) {
      let that = this
      let param = {
        draftId: draftId,
      }
      this.$axios.post('/draft/deleteDraft', param).then(response => {
        if (response.data.message === 'success') {
          that.$message.success("成功移除草稿")
          that.getDraftList()
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    getDraftList() {
      const that = this
      that.loadingData = true
      this.$axios.post('/draft/getDraftList').then(response => {
        if (response.data.message === 'success') {
          that.draftList = response.data.draftList
          that.loadingData = false
          //获取剩余可添加的草稿数量
          that.getSurplusDraftCount()
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
.tagBox {
  display: flex;
  margin-bottom: 15px;
  background-color: #fdf6ec ;
  width: 30%;
  border-radius: 20px;
}
.tagTextLeft {
  width: 85%;
  color: #E6A23C;
  line-height: 40px;
  height: 40px;
 }
.tagTextRight {
  color: #3e76f6;
  line-height: 40px;
  height: 40px;
}
.tableBox {
  width: 100%;
  border-radius: 25px;
}
</style>
