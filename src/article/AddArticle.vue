<template>
  <div>
    <h1>创建博文</h1>
    <Markdown @on-save="handleOnSave"/>
  </div>
</template>

<script>
import Markdown from 'vue-meditor';

export default {
  name: 'AddArticle',
  components: {
    Markdown
  },
  methods: {
    handleOnSave({value, theme}){
      console.log(value, theme);
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
