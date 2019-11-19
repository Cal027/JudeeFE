<template>
  <el-menu id="nav" :default-active="activeIndex" :router="true" mode="horizontal">
    <el-menu-item id="title" index="/">
      <el-image :src="logo_url" class="logo"/>
    </el-menu-item>
    <el-menu-item index="/home">
      <i class="el-icon-data-board"/>首页
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
    <el-menu-item index="/todolist">
      <i class="el-icon-s-promotion"/>待办事项
    </el-menu-item>
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
            activeIndex: '/home',
            loginShow: sessionStorage.username,
            username: sessionStorage.username,
            nickname: sessionStorage.nickname,
            logo_url: '@/assets/images/logo2.png'
        }
    },
    mounted () {
        this.activeIndex = this.$route.path
    },
    methods: {
        handleCommand (command) {
            if (command === 'logout') {
                this.$api.user.logout()
                    .then(response => {
                        this.$message({
                            message: '注销成功！',
                            type: 'success'
                        })
                        sessionStorage.setItem('username', '')
                        sessionStorage.setItem('name', '')
                        sessionStorage.setItem('rating', '')
                        sessionStorage.setItem('type', '')
                        this.loginShow = 0
                        this.username = ''
                        this.$router.push('/')
                    }).catch(error => {
                        this.$message.error(
                            '服务器错误！' + '(' + JSON.stringify(error.response.data) + ')'
                        )
                    })
            }
            if (command === 'home') {
                this.$router.push({
                    name: 'user',
                    query: { username: sessionStorage.username }
                })
            }
            if (command === 'profile') {
                this.$router.push({
                    name: 'profile',
                    params: { username: sessionStorage.username }
                })
            }
            if (command === 'submit') {
                this.$router.push({
                    name: 'statue',
                    query: { username: sessionStorage.username }
                })
            }
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
        height: 54px
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