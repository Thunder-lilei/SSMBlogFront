<template>
  <div class="gitalk-container">
    <div id="gitalk-container"></div>
  </div>
</template>

<script>
export default {
  name: 'GitTalk',
  data() {
    return {};
  },
  mounted() {
    let body = document.querySelector('.gitalk-container');
    let script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js';
    body.appendChild(script);
    script.onload = () => {
      const commentConfig = {
        clientID: 'dff2943d5c80f6d8abad',
        clientSecret: '3ab9c0d346b07642d42733ea8490855fa4ea88c7',
        repo: 'SSMBlogTalk',
        owner: 'Thunder-lilei',
        // 这里接受一个数组，可以添加多个管理员，可以是你自己
        admin: ['Thunder-lilei'],
        // id 用于当前页面的唯一标识，一般来讲 pathname 足够了，
        // 但是如果你的 pathname 超过 50 个字符，GitHub 将不会成功创建 issue，此情况可以考虑给每个页面生成 hash 值的方法.
        id: location.pathname,
        distractionFreeMode: false,
      };
      const gitalk = new Gitalk(commentConfig);
      gitalk.render('gitalk-container');
    };
  },
}
</script>
<style>
@import 'gittalk.css';
</style>
<style scoped>

</style>
