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
      <div class="tagBox">
        <div class="tagTextLeft">
          博文总数：
        </div>
        <div class="tagTextRight">
          {{ articleUserArticleCount }}
        </div>
        <div class="tagTextLeft">
          粉丝数：
        </div>
        <div class="tagTextRight">
          {{ articleUserFunCount }}
        </div>
      </div>
      <div class="articleListBox">
        <div class="tagTextLeft">
          最新博文：
        </div>
        <div class="articleBox" v-for="(item, index) in articleUserNewArticleList">
          <div class="articleTitleText">
            <el-link class="linkText" @click="toShowArticle(item.articleId, articleUser.userId)">
              {{ item.articleTitle }}
              <i class="el-icon-view el-icon--right"></i>
            </el-link>
          </div>
          <div class="articleDateText">
            {{ item.articleDate }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArticleUserInfo',
  props: [
    "articleUser",
    "articleUserArticleCount",
    "articleUserFunCount",
    "articleUserNewArticleList",
    "isOnShowArticle",
  ],//当前博主
  data() {
    return {
    }
  },
  created () {
  },
  methods: {
    toShowArticle:function (articleId, articleUserId) {
        this.$router.push({name:'ArticleBus', params: {articleId: articleId, articleUserId: articleUserId}});
    },
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
  margin-bottom: 10px;
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
.articleListBox {
  width: 300px;
  margin-bottom: 10px;
  background-color: #fdf6ec ;
  border-radius: 20px;
}
.articleBox {
  display: flex;
  color: #3e76f6;
  line-height: 40px;
  height: 40px;
}
.articleTitleText {
  margin-left: 5%;
  width: 60%;
}
.linkText {
  color: #3e76f6;
  display: -webkit-box;/*作为弹性伸缩盒子模型显示*/
  -webkit-line-clamp: 1; /*显示的行数；如果要设置2行加...则设置为2*/
  overflow: hidden; /*超出的文本隐藏*/
  text-overflow: ellipsis; /* 溢出用省略号*/
  -webkit-box-orient: vertical;/*伸缩盒子的子元素排列：从上到下*/
}
.articleDateText {
  width: 40%;
}
</style>
