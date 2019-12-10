<template>
    <el-menu :default-active="activeIndex" text-color="#170317"
             router mode="horizontal" v-sticky class="nav">
        <el-menu-item index="/">
            <d2-icon-svg name="logo-text" class="logo"/>
        </el-menu-item>
        <el-menu-item index="/home">
            <i class="el-icon-data-board"/>首页
        </el-menu-item>
        <el-menu-item index="/problem">
            <i class="el-icon-tickets"/>题库
        </el-menu-item>
        <el-menu-item index="/statue">
            <i class="iconfont j-icon-tiku"/>评测记录
        </el-menu-item>
        <el-menu-item index="/contest">
            <i class="el-icon-trophy"/>竞赛
        </el-menu-item>
        <el-menu-item index="/rank">
            <i class="iconfont j-icon-paiming"/>排名
        </el-menu-item>
        <el-menu-item index="/tutorial">
            <i class="iconfont j-icon-wiki-"/>教程
        </el-menu-item>
        <el-dropdown
                v-show="loginShow"
                class="user"
                type="text"
                :show-timeout="100"
                :split-button="true"
                @click="handleClick"
                @command="handleCommand">
            <span class="el-dropdown-link">{{ nickname }}</span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="home">主页</el-dropdown-item>
                <el-dropdown-item command="submit">提交</el-dropdown-item>
                <el-link href="admin" v-show="isAdmin" :underline="false">
                    <el-dropdown-item>管理</el-dropdown-item>
                </el-link>
                <el-dropdown-item command="logout" divided>注销</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <router-link v-if="!loginShow" to="/register">
            <el-button type="text" class="button">注册</el-button>
        </router-link>
        <router-link v-if="!loginShow" to="/login">
            <el-button type="text" class="button">登录</el-button>
        </router-link>
        <el-tooltip content="Judee主题色">
            <ColorPicker style="float: right; margin: 15px 5px"/>
        </el-tooltip>
        <el-button v-show="backShow" size="small" class="back-button" icon="el-icon-back" circle @click="handleBack"/>
    </el-menu>
</template>

<script>
import ColorPicker from '@oj/components/ColorPicker'
import util from '@/utils/util'

export default {
  name: 'NavBar',
  components: { ColorPicker },
  data () {
    return {
      isAdmin: true,
      backShow: false,
      activeIndex: '/home',
      nickname: localStorage.getItem('nickname'),
      loginShow: localStorage.getItem('username'),
      username: localStorage.getItem('username')
    }
  },
  mounted () {
    this.activeIndex = this.$route.path
    this.isAdmin = localStorage.getItem('type') !== '1'
  },
  watch: {
    $route (now) {
      this.backShow = !(now.path === '/' || now.path === '/home')
    }
  },
  methods: {
    handleClick () {
      this.$router.push({
        name: 'user',
        params: { username: localStorage.username }
      })
    },
    handleCommand (command) {
      if (command === 'logout') {
        this.$message({
          message: '注销成功！',
          type: 'success'
        })
        localStorage.removeItem('JWT_TOKEN')
        util.cookies.remove('tokenOJ')
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
          params: { username: localStorage.username }
        })
      }
      if (command === 'submit') {
        this.$router.push({
          name: 'status',
          params: { username: localStorage.username }
        })
      }
    },
    handleBack () {
      this.$router.back()
    }
  }

}
</script>

<style scoped>
    .nav {
        min-width: 1100px;
        z-index: 888;
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
        font-size: 17px;
        margin: 10px;
    }

    .back-button {
        float: right;
        margin-top: 15px;
        margin-right: 5px;
    }

    .user {
        float: right;
        margin: 10px;
    }

    .iconfont {
        font-size: 18px;
        margin-right: 5px
    }
</style>
