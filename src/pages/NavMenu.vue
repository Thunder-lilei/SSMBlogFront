<template>
<div style="height: 925px;margin: 0 0 0 10%">
  <Header></Header>
  <el-radio-group v-model="isCollapse" style="margin: 0 65% 20px 0">
    <el-button @click="labelControl" type="primary" icon="el-icon-menu" circle></el-button>
  </el-radio-group>
  <el-menu v-show="isCollapse" :style="menuStyle" default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="true">
    <el-submenu index="1">
      <template slot="title">
        <router-link to='/UserControl'>
          <i class="el-icon-user-solid"></i>
        </router-link>
        <span slot="title">导航一</span>
      </template>
      <el-menu-item-group>
        <span slot="title">用户管理</span>
        <el-menu-item index="1-1">选项1</el-menu-item>
        <el-menu-item index="1-2">选项2</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="分组2">
        <el-menu-item index="1-3">选项3</el-menu-item>
      </el-menu-item-group>
      <el-submenu index="1-4">
        <span slot="title">选项4</span>
        <el-menu-item index="1-4-1">选项1</el-menu-item>
      </el-submenu>
    </el-submenu>
    <el-menu-item index="2">
      <i class="el-icon-menu"></i>
      <span slot="title">导航二</span>
    </el-menu-item>
    <el-menu-item index="3" disabled>
      <i class="el-icon-document"></i>
      <span slot="title">导航三</span>
    </el-menu-item>
    <el-menu-item index="4">
      <i class="el-icon-setting"></i>
      <span slot="title">导航四</span>
    </el-menu-item>
  </el-menu>
</div>
</template>

<script>
import Header from './Header'
export default {
  name: 'NavMenu',
  components: {Header},
  data() {
    return {
      isCollapse: false,
      menuStyle: 'opacity:0.5;width: 35%',
    };
  },
  methods: {
    labelControl() {
      this.isCollapse = !this.isCollapse
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
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
