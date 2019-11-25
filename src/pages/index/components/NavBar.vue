<template>
  <el-menu id="nav" :default-active="activeIndex" :router="true" mode="horizontal">
    <el-menu-item id="title" index="/">
<!--       <el-image :src="`/image/logo2.png`" class="logo"/>-->
      <d2-icon-svg name="logo-text" class="logo" />
    </el-menu-item>
    <el-menu-item index="/home">
      <i class="el-icon-data-board"></i>首页
    </el-menu-item>
    <el-menu-item index="/problem">
      <i class="el-icon-tickets"/>题库
    </el-menu-item>
    <el-menu-item index="/statue">
      <i class="el-icon-tickets"/>评测记录
    </el-menu-item>
    <el-menu-item index="/contest">
      <i class="el-icon-trophy"/>比赛
    </el-menu-item>
    <el-menu-item index="/rank">
      <i class="el-icon-star-on"/>排名
    </el-menu-item>
    <el-menu-item index="/tutorial">
      <i class="el-icon-reading"/>教程
    </el-menu-item>
    <el-button v-show="backShow" class="button" icon="el-icon-back" type="text" circle @click="handleBack"></el-button>
    <router-link v-if="!loginShow" to="/register">
      <el-button round class="button">注册</el-button>
    </router-link>
    <router-link v-if="!loginShow" to="/login">
      <el-button round class="button">登录</el-button>
    </router-link>
    <el-dropdown
      v-show="loginShow"
      id="user"
      :show-timeout="100"
      :split-button="true"
      @command="handleCommand">
      <span class="el-dropdown-link">{{ nickname }}</span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="home">主页</el-dropdown-item>
        <el-dropdown-item command="submit">提交</el-dropdown-item>
        <el-dropdown-item command="logout" divided>注销</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script>
export default {
  name: 'NavBar',
  data () {
    return {
      backShow: false,
      activeIndex: '/home',
      nickname: localStorage.getItem('nickname'),
      loginShow: localStorage.getItem('username'),
      username: localStorage.getItem('username')
    }
  },
  mounted () {
    this.activeIndex = this.$route.path
  },
  watch: {
    $route (now) {
      this.backShow = !(now.path === '/' || now.path === '/home')
    }
  },
  methods: {
    handleCommand (command) {
      if (command === 'logout') {
        this.$message({
          message: '注销成功！',
          type: 'success'
        })
        localStorage.removeItem('JWT_TOKEN')
        localStorage.removeItem('username')
        localStorage.removeItem('nickname')
        localStorage.removeItem('ac_prob')

        this.loginShow = 0
        this.username = ''
        this.$router.push('/')
      }
      if (command === 'home') {
        this.$router.push({
          name: 'user',
          query: { username: localStorage.username }
        })
      }
      if (command === 'profile') {
        this.$router.push({
          name: 'profile',
          params: { username: localStorage.username }
        })
      }
      if (command === 'submit') {
        this.$router.push({
          name: 'statue',
          query: { username: localStorage.username }
        })
      }
    },
    handleBack () {
      this.$router.back()
      console.log(this.activeIndex)
    }
  }

}
</script>

<style scoped>
    #nav {
        background-color: #ffffff;
        min-width: 1100px;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 1000;
        width: 100%;
        height: 60px;
        box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
    }

    .logo {
        width: 96px;
        height: 54px;
        margin-bottom: 8px;
    }

    .el-dropdown-link {
        cursor: pointer;
        color: #409eff;
    }

    .button {
        float: right;
        margin: 10px;
    }

    #user {
        float: right;
        margin: 10px;
    }
</style>
