<template>
  <div>
    <h2 v-text="title"></h2>
    <button @click="getQuizs">getQuiz</button>
    <ul>
      <li v-for="item in allList">
        <span>{{ item.id }}</span><span>{{ item.question }}</span>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  name: 'TestMessage',
  data () {
    return {
      title: 'TestMessage',
      allList:[]
    }
  },
  methods: {
    getQuizs:function() {
      const that = this
      this.$axios.post('/answer/getAllQuizBaseInfo').then(response => {
        that.allList = response.data.allList
        console.log(response.data.allList)
      }).catch(
        function (error) {
          // 请求失败处理
          alert('请求失败！')
        })
    }
  }
}
</script>

<style scoped>

</style>
