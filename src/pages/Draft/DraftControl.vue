<template>
  <div>
    <h1>草稿</h1>
    <el-table
      :data="draftList"
      style="width: 100%">
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
</template>

<script>
export default {
  name: 'DraftControl',
  data() {
    return {
      draftList: [], //草稿列表
    }
  },
  created () {
    this.getDraftList()
  },
  methods: {
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
    toShowDraft() {

    },
    getDraftList() {
      const that = this
      this.$axios.post('/draft/getDraftList').then(response => {
        if (response.data.message === 'success') {
          that.draftList = response.data.draftList
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

</style>
