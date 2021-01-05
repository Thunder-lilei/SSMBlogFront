<template>
  <div>
    <h1 v-show="updateShow">编辑博文</h1>
    <h1 v-show="!updateShow">创建博文</h1>
    <el-form :model="articleForm" :rules="rules" ref="ruleForm" label-width="" class="demo-ruleForm">
      <el-form-item prop="articleTitle">
        <el-input v-model="articleForm.articleTitle" placeholder="博文标题"></el-input>
      </el-form-item>
      <el-form-item prop="articleContent">
        <Markdown @on-save="handleOnSave" v-model="articleForm.articleContent"/>
      </el-form-item>
      <el-form-item>
        <el-button v-show="updateShow" type="primary" @click="updateArticle('ruleForm')">修改</el-button>
        <el-button v-show="!updateShow" type="primary" @click="addArticle('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Markdown from 'vue-meditor';
import marked from 'marked'

export default {
  name: 'AddArticle',
  components: {
    Markdown
  },
  data() {
    return {
      articleForm: {
        articleContent: '',
        articleTitle: '',
      },
      rules: {
        articleTitle: [
          { required: true, message: '请填写博文标题', trigger: 'blur' },
        ],
      },
      updateShow: false,
    }
  },
  mounted () {
    this.getArticle()
  },
  methods: {
    getArticle:function () {
      const that = this
      this.$axios.post('/article/getArticle').then(response => {
        if (response.data.message === 'success') {
          console.log(response.data.article)
          that.articleForm = response.data.article
          that.updateShow = true
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
    addArticle:function (formName) {
      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/article/addArticle', this.articleForm).then(response => {
            if (response.data.message === 'success') {
              that.$message({
                showClose: true,
                message: '保存成功！',
                type: 'success'
              });
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
        }
      })
    },
    updateArticle:function (formName) {
      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/article/updateArticle', this.articleForm).then(response => {
            if (response.data.message === 'success') {
              that.$message({
                showClose: true,
                message: '修改成功！',
                type: 'success'
              });
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
        }
      })
    },
    handleOnSave({value, theme}){
      this.articleForm.articleContent = value
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
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
