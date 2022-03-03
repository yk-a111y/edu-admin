<template>
  <div class="layout">
    <el-container>
      <el-aside width="200px">
        <!-- AppAside组件 -->
        <app-aside></app-aside>
      </el-aside>
      <el-container>
        <el-header>
          <!-- AppHeader组件 -->
          <app-header></app-header>
        </el-header>
        <el-main>
          <!-- 子路由出口 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import AppAside from './components/AppAside.vue'
import AppHeader from './components/AppHeader.vue'

export default {
  name: 'layout',
  components: {
    AppAside,
    AppHeader
  }
}
</script>

<style lang="scss">
  .el-container {
    height: 100vh;
    min-width: 980px;
  }
  .el-aside {
    background-color: #d3dce6;
  }
  .el-header {
    background-color: #fff;
  }
  .el-main {
    background-color: #e9eef3;
  }
</style>
