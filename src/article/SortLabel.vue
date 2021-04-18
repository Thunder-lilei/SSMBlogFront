<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="color: #42b983;font-size: 25px">分类</span>
      </div>
      <div>
        <el-tag
          :key="sort.sortName"
          v-for="sort in sortList"
          :disable-transitions="false"
          style="margin: 2% 2% 2% 2% "
        >
        <el-badge style="margin: 0 0 0 3%" :value="sort.num" :max="99" class="item">
          <el-link type="primary" :underline="false" @click="showSortAboutArticle(sort.sortId)">{{ sort.sortName }}</el-link>
        </el-badge>
        </el-tag>
      </div>
    </el-card>
    <el-card style="margin: 5% 0 0 0" class="box-card">
      <div slot="header" class="clearfix">
        <span style="color: #42b983;font-size: 25px">标签</span>
      </div>
      <div>
        <el-tag
          :key="label.labelName"
          v-for="label in labelList"
          :disable-transitions="false"
          style="margin: 2% 2% 2% 2% "
        >
        <el-badge style="margin: 0 0 0 3%" :value="label.num" :max="99" class="item">
          <el-link type="primary" :underline="false" @click="showLabelAboutArticle(label.labelId)">{{label.labelName}}</el-link></el-badge>
        </el-tag>
      </div>
    </el-card>
  </div>
</template>

<script>
import bus from '../router/bus'

export default {
  name: 'SortLabel',
  data() {
    return {
      labelList: [],
      sortList: [],
      newLabelVisible: false,
      newSortVisible: false,
    }
  },
  created () {
    this.getMyLabel()
    this.getMySort()
  },
  methods: {
    showSortAboutArticle:function (sortId) {
      const that = this
      let data = new URLSearchParams();
      data.append("sortId", sortId)
      this.$axios.post('/article/setSortId', data).then(response => {
        if (response.data.message === 'success') {
          this.$router.push('/ArticleControl');
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
    showLabelAboutArticle:function (labelId) {
      const that = this
      let data = new URLSearchParams();
      data.append("labelId", labelId)
      this.$axios.post('/article/setLabelId', data).then(response => {
        if (response.data.message === 'success') {
          this.$router.push('/ArticleControl');
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
    getMyLabel:function () {
      const that = this
      this.$axios.post('/label/getMyLabel').then(response => {
        if (response.data.message === 'success') {
          that.labelList = response.data.labelList
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
    getMySort:function () {
      const that = this
      this.$axios.post('/sort/getMySort').then(response => {
        if (response.data.message === 'success') {
          that.sortList = response.data.sortList
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

<style>
a {
  text-decoration: none;
}

</style>
