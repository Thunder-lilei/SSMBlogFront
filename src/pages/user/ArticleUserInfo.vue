<template>
  <div class="userInfoBox">
    <div v-show="JSON.stringify(articleUser) !== '{}'">
      <div class="tagBox">
        <div class="tagTextLeft">
          当前博主：
        </div>
        <div class="tagTextRight">
          {{ articleUser.userNickname }}
        </div>
      </div>
      <div class="tagBox">
        <div class="tagTextLeft">
          联系方式：
        </div>
        <div class="tagTextRight">
          {{ articleUser.userEmail }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArticleUserInfo',
  props: ["articleUser"],//当前博主
  data() {
    return {
      articleUserId: '', //其他博主ID
    }
  },
  methods: {

  }
}
</script>

<style scoped>
.userInfoBox {
  position: fixed;
  right: 100px;
}
.tagBox {
  width: 300px;
  display: flex;
  margin-bottom: 15px;
  background-color: #fdf6ec ;
  border-radius: 20px;
}
.tagTextLeft {
  width: 40%;
  color: #E6A23C;
  line-height: 40px;
  height: 40px;
}
.tagTextRight {
  color: #3e76f6;
  line-height: 40px;
  height: 40px;
}
</style>
