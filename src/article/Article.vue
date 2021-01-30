<template>
  <div>
    <h1 v-show="updateShow">编辑博文</h1>
    <h1 v-show="!updateShow">创建博文</h1>
    <el-form :model="articleForm" :rules="rules" ref="ruleForm" label-width="" class="demo-ruleForm">
      <el-form-item prop="articleTitle">
        <el-input v-model="articleForm.articleTitle" placeholder="博文标题"></el-input>
      </el-form-item>
      <div style="display: flex;background-color: white;margin: 0 0 3% 0">
        <div style="width: 50%;margin: 1% 0 1% 0">
          <h3 style="margin: 0 0 1% 3%;text-align: left;">
            分类：
            <el-button icon="el-icon-plus" size="small" round>添加分类</el-button>
          </h3>
          <template>
            <el-checkbox-group
              v-model="checkedSorts"
              :min="1"
              :max="5"
            >
              <el-checkbox v-for="sort in allSort" :label="sort.sortId" :key="sort.sortId">{{sort.sortName}}</el-checkbox>
            </el-checkbox-group>
          </template>
        </div>
        <div style="width: 50%;margin: 1% 0 1% 0">
          <h3 style="margin: 0 0 1% 3%;text-align: left;">
            标签：
            <el-button icon="el-icon-plus" size="small" round>添加标签</el-button>
          </h3>
          <template>
            <el-checkbox-group
              v-model="checkedSorts"
              :min="1"
              :max="5"
            >
              <el-checkbox v-for="label in allLabel" :label="label.labelId" :key="label.labelId">{{label.labelName}}</el-checkbox>
            </el-checkbox-group>
          </template>
        </div>
      </div>
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
      allSort: [],
      checkedSorts: [],
      allLabel: [],
      checkedLabels: [ ],
    }
  },
  mounted () {
    this.getArticle()
    this.getAllSort()
    this.getAllLabel()
  },
  methods: {
    getAllLabel:function() {
      const that = this
      this.$axios.post('/label/getAllLabel').then(response => {
        if (response.data.message === 'success') {
          that.allLabel = response.data.labelList
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
    getAllSort:function() {
      const that = this
      this.$axios.post('/sort/getAllSort').then(response => {
        if (response.data.message === 'success') {
          that.allSort = response.data.sortList
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
    getArticle:function () {
      const that = this
      this.$axios.post('/article/getShowArticle').then(response => {
        if (response.data.message === 'success') {
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
