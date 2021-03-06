<template>
  <div>
    <div>
    <h1 v-if="isEditArticle">编辑博文</h1>
    <h1 v-else-if="isCreateArticle">创建博文</h1>
    <h1 v-else-if="isEditDraft">编辑草稿</h1>
    <h1 v-else>未知的情况</h1>
    <el-form :model="articleForm" :rules="rules" ref="ruleForm" label-width="" class="demo-ruleForm">
      <el-form-item prop="articleTitle">
        <el-input v-model="articleForm.articleTitle" placeholder="博文标题"></el-input>
      </el-form-item>
      <div style="display: flex;background-color: white;margin: 0 0 3% 0">
        <div style="width: 50%;margin: 1% 0 1% 0">
          <h3 style="margin: 0 0 1% 3%;text-align: left;">
            分类：
          </h3>
          <el-tag
            :key="sort.sortName"
            v-for="sort in checkedSorts"
            closable
            :disable-transitions="false"
            @close="removeCheckedArticleSorts(sort)">
            {{sort.sortName}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="newSortVisible"
            v-model="newSort.sortName"
            ref="saveTagInput"
            size="small"
            @blur="addCheckedSorts"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showAddArticleSortInput">+ 添加分类</el-button>
        </div>
        <div style="width: 50%;margin: 1% 0 1% 0">
          <h3 style="margin: 0 0 1% 3%;text-align: left;">
            标签：
          </h3>
          <el-tag
            :key="label.labelName"
            v-for="label in checkedLabels"
            closable
            :disable-transitions="false"
            @close="removeCheckedArticleLabels(label)">
            {{label.labelName}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="newLabelVisible"
            v-model="newLabel.labelName"
            ref="saveTagInput"
            size="small"
            @blur="addCheckedLabels"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showAddArticleLabelInput">+ 添加标签</el-button>
        </div>
      </div>
      <el-form-item prop="articleContent">
        <Markdown @on-save="handleOnSave" v-model="articleForm.articleContent"/>
      </el-form-item>
      <el-form-item>
        <el-button v-if="isEditArticle" type="primary" @click="updateArticle('ruleForm')">修改</el-button>
        <el-button v-if="!isEditDraft && !isEditArticle" type="primary" @click="addDraft('ruleForm')">保存</el-button>
        <el-button v-if="isEditDraft" type="primary" @click="editDraft('ruleForm')">保存</el-button>
        <el-button v-if="isEditDraft" type="success" @click="uploadDraft()">发布</el-button>
        <el-button v-if="isCreateArticle" type="primary" @click="addArticle('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
    </div>
    <div class="userInfoDiv">
      <UserInfo></UserInfo>
    </div>
  </div>
</template>

<script>
import Markdown from 'vue-meditor';
import UserInfo from '../user/UserInfo'

export default {
  name: 'AddArticle',
  components: {
    UserInfo,
    Markdown
  },
  data() {
    return {
      articleForm: {
        articleId: '',
        draftId: '',
        articleContent: '',
        articleTitle: '',
      },
      rules: {
        articleTitle: [
          { required: true, message: '请填写博文标题', trigger: 'blur' },
        ],
      },
      updateShow: false, //当前博文是否是需要更新的博文
      isDraft: false, // 当前博文是否是草稿
      isCreateArticle: true, //创建博文
      isEditArticle: false, //编辑博文
      isEditDraft: false, //编辑草稿
      newLabel: {
        labelName: '',
      },
      newSort: {
        sortName: '',
      },
      newLabelVisible: false,
      newSortVisible: false,
      checkedSorts: [],
      checkedLabels: [],
      draftId: '', //草稿ID
    }
  },
  created () {
    this.getArticle()
    this.getShowDraft()
  },
  methods: {
    uploadDraft() {
      let that = this
      let param = {
        draftId : this.articleForm.draftId,
      }
      this.$axios.post('/draft/uploadDraft', param).then(response => {
        if (response.data.message === 'success') {
          that.$message.success("发布成功！")
          that.$router.push('/DraftControl');
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    getShowDraft() {
      let that = this
      this.$axios.post('/draft/getShowDraft').then(response => {
        if (response.data.message === 'success') {
          that.isEditArticle = false
          that.isCreateArticle = false
          that.isEditDraft = true
          that.articleForm = response.data.showDraft
          that.getDraftLabel(that.articleForm.draftId)
          that.getDraftSort(that.articleForm.draftId)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    removeCheckedArticleSorts:function (sort) {
      this.checkedSorts.splice(this.checkedSorts.indexOf(sort), 1);
    },
    addCheckedSorts:function () {
      if (this.checkedSorts.findIndex(item => item.sortName === this.newSort.sortName) === -1) {
        this.checkedSorts.push(this.newSort)
      }
      this.newSortVisible = false
      this.newSort = {}
    },
    showAddArticleSortInput() {
      this.newSortVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    removeCheckedArticleLabels:function (label) {
      this.checkedLabels.splice(this.checkedLabels.indexOf(label), 1);
    },
    addCheckedLabels:function () {
      if (this.checkedLabels.findIndex(item => item.labelName === this.newLabel.labelName) === -1) {
        this.checkedLabels.push(this.newLabel)
      }
      this.newLabelVisible = false
      this.newLabel = {}
    },
    showAddArticleLabelInput() {
      this.newLabelVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    getArticle:function () {
      const that = this
      this.$axios.post('/article/getShowArticle').then(response => {
        if (response.data.message === 'success') {
          that.articleForm = response.data.article
          that.isEditArticle = true
          that.isCreateArticle = false
          that.isEditDraft = false
          that.getArticleLabel(response.data.article.articleId)
          that.getArticleSort(response.data.article.articleId)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    getDraftLabel (draftId) {
      const that = this
      let data = new URLSearchParams();
      data.append("draftId", draftId)
      this.$axios.post('/articleLabel/getDraftLabel', data).then(response => {
        if (response.data.message === 'success') {
          that.checkedLabels = response.data.labelList
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    getDraftSort (draftId) {
      const that = this
      let data = new URLSearchParams();
      data.append("draftId", draftId)
      this.$axios.post('/articleSort/getDraftSort', data).then(response => {
        if (response.data.message === 'success') {
          that.checkedSorts = response.data.sortList
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    getArticleLabel (articleId) {
      const that = this
      let data = new URLSearchParams();
      data.append("articleId", articleId)
      this.$axios.post('/articleLabel/getArticleLabel', data).then(response => {
        if (response.data.message === 'success') {
          that.checkedLabels = response.data.labelList
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    getArticleSort (articleId) {
      const that = this
      let data = new URLSearchParams();
      data.append("articleId", articleId)
      this.$axios.post('/articleSort/getArticleSort', data).then(response => {
        if (response.data.message === 'success') {
          that.checkedSorts = response.data.sortList
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.error(error)
        })
    },
    addDraft:function (formName) {
      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/draft/addDraft', {draft:JSON.stringify(this.articleForm),
            labelList:JSON.stringify(this.checkedLabels), sortList:JSON.stringify(this.checkedSorts)}).then(response => {
            if (response.data.message === 'success') {
              that.$message.success("草稿保存成功！")
              that.$router.push('/DraftControl');
            } else {
              that.$message.warning(response.data.message)
            }
          }).catch(
            function (error) {
              that.$message.error(error)
            })
        }
      })
    },
    editDraft:function (formName) {
      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/draft/updateDraft', {draft:JSON.stringify(this.articleForm),
            labelList:JSON.stringify(this.checkedLabels), sortList:JSON.stringify(this.checkedSorts)}).then(response => {
            if (response.data.message === 'success') {
              that.$message.success("草稿更新成功！")
              that.$router.push('/DraftControl');
            } else {
              that.$message.warning(response.data.message)
            }
          }).catch(
            function (error) {
              that.$message.error(error)
            })
        }
      })
    },
    addArticle:function (formName) {
      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/article/addArticle', {article:JSON.stringify(this.articleForm),
            labelList:JSON.stringify(this.checkedLabels), sortList:JSON.stringify(this.checkedSorts)}).then(response => {
            if (response.data.message === 'success') {
              that.$message.success("发布成功！")
              that.$router.push({name:'ArticleControl'});
              that.$router.go(0)
            } else {
              that.$message.warning(response.data.message)
            }
          }).catch(
            function (error) {
              that.$message.error(error)
            })
        }
      })
    },
    updateArticle:function (formName) {
      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/article/updateArticle', {article:JSON.stringify(this.articleForm),
            labelList:JSON.stringify(this.checkedLabels), sortList:JSON.stringify(this.checkedSorts)} ).then(response => {
            if (response.data.message === 'success') {
              // that.getArticleLabel(that.articleForm.articleId)
              // that.getArticleSort(that.articleForm.articleId)
              that.$message.success("修改成功！")
              that.$router.push('/ArticleControl');
            } else {
              that.$message.warning(response.data.message)
            }
          }).catch(
            function (error) {
              that.$message.error(error)
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
.userInfoDiv {
  position: fixed;
  top: 200px;
}
</style>
