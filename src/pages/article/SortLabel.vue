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
    <el-card class="box-card cardBox">
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
    <el-card class="box-card cardBox">
      <div class="radio">
        时间：
        <el-radio-group v-model="reverse">
          <el-radio :label="true">正序</el-radio>
          <el-radio :label="false">倒序</el-radio>
        </el-radio-group>
      </div>
      <br/>
        <el-timeline :reverse="reverse">
          <el-timeline-item
            v-for="(item, index) in articleList"
            :key="index"
            :timestamp="item.createTime">
            {{ item.articleTitle }}
          </el-timeline-item>
        </el-timeline>
      <div>
        <el-link @click="loadArticleList" class="el-icon-more"></el-link>
      </div>
    </el-card>
  </div>
</template>

<script>
import bus from '../../router/bus'

export default {
  name: 'SortLabel',
  data() {
    return {
      reverse: false, //博文列表顺序
      articleList: [], // 当前用户博文列表
      articleListCount: 0, // 当前用户博文总数
      pageIndex: 0, //起始下标
      pageSize: 5, //每页数量
      pageSizeAdd: 5, //翻页数量
      labelList: [],
      sortList: [],
      newLabelVisible: false,
      newSortVisible: false,
    }
  },
  created () {
    this.getMyLabel()
    this.getMySort()
    this.getArticleByUserOrder()
  },
  methods: {
    loadArticleList() {
      this.pageSize += this.pageSizeAdd
      console.log(this.pageSize)
      if (this.pageSize >= (this.articleListCount + this.pageSizeAdd)) {
        this.$message.warning("到底啦！")
      } else {
        this.getArticleByUserOrder()
      }
    },
    getArticleByUserOrder() {
      const that = this
      let pageParam = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      }
      this.$axios.post('/article/getArticleByUserOrder', pageParam).then(response => {
        if (response.data.message === 'success') {
          that.articleList = response.data.articleList
          that.articleListCount = response.data.articleListCount
        } else {
          that.$message.warning(response.data.message)
        }
      }).catch(
        function (error) {
          that.$message.warning(error)
        })
    },
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
.cardBox {
  margin: 5% 0 0 0;
}
</style>

<style>
a {
  text-decoration: none;
}

</style>
