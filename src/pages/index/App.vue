<template>
  <div id="app">
    <NavBar/>
    <el-backtop :bottom="50">
      <div class="back">
        <i class="el-icon-top"/>
      </div>
    </el-backtop>
    <div class="content">
      <transition name="el-fade-in-linear" mode="out-in">
        <router-view/>
      </transition>
    </div>
  </div>
</template>

<script>
import NavBar from './components/NavBar'

export default {
  name: 'App',
  components: { NavBar },
  mounted () {
  }
}
</script>

<style scoped>
    .el-dropdown-link {
        cursor: pointer;
        color: #409eff;
    }

    .content {
        margin-top: 80px;
        padding: 0 2%;
    }

    .back {
        height: 100%;
        width: 100%;
        background-color: #f2f5f6;
        box-shadow: 0 0 6px rgba(0, 0, 0, .12);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
    }
</style>
