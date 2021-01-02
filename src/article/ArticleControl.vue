<template>
  <div>
    <h1>博文管理</h1>
    <router-link to='/addArticle'>
      <el-button style="margin: 0 90% 0 0 " type="success" icon="el-icon-plus" circle></el-button>
    </router-link>
    <br/><br/>
    <el-table
      :data="articleList"
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        width="180">
      </el-table-column>
      <el-table-column
        prop=""
        label="标题"
        width="180">
      </el-table-column>
      <el-table-column
        align="right">
        <template slot="header" slot-scope="scope">
          <el-input
            @keyup.enter.native=""
            v-model="keyValue"
            size="max"
            placeholder="输入关键字搜索"/>
        </template>
        <template slot-scope="scope">
          <el-button @click="" type="primary" icon="el-icon-edit" circle></el-button>
          <el-popconfirm
            title="确定删除吗？"
            @confirm=""
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
  name: 'ArticleControl',
  data() {
    return {
      articleList: [],
      keyValue: '',
      lastPage: '',
      total: 0,
      pageNow: 1,
      pageSize: 10,
    }
  },
  methods: {
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
