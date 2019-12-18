<template>
    <el-menu :default-active="$route.path" text-color="#608290"
             background-color="#E3E8E7"
             v-sticky
             on-stick="handleSticky"
             router mode="horizontal" class="nav">
        <el-menu-item index="/">
            <d2-icon-svg name="logo" class="logo"/>
        </el-menu-item>
        <el-menu-item index="/home">
            <i class="el-icon-data-board icon-color"/>首页
        </el-menu-item>
        <el-menu-item index="/problem">
            <i class="el-icon-tickets icon-color"/>题库
        </el-menu-item>
        <el-menu-item index="/status">
            <i class="iconfont j-icon-tiku icon-color"/>评测记录
        </el-menu-item>
        <el-menu-item index="/contest">
            <i class="el-icon-trophy icon-color"/>竞赛
        </el-menu-item>
        <el-menu-item index="/rank">
            <i class="iconfont j-icon-paiming icon-color"/>排名
        </el-menu-item>
        <el-menu-item index="/tutorial">
            <i class="iconfont j-icon-wiki- icon-color"/>教程
        </el-menu-item>
        <el-dropdown
                v-show="info.username"
                class="user"
                type="text"
                :show-timeout="100"
                :split-button="true"
                @click="handleClick"
                @command="handleCommand">
            <span class="el-dropdown-link">{{ info.nickname }}</span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="home">主页</el-dropdown-item>
                <el-dropdown-item command="submit">提交</el-dropdown-item>
                <el-dropdown-item command="updateRanking">更新排名</el-dropdown-item>
                <el-link href="/admin" v-show="isAdmin" :underline="false">
                    <el-dropdown-item>
                        管理
                    </el-dropdown-item>
                </el-link>
                <el-dropdown-item>
                    主题色
                    <ColorPicker/>
                </el-dropdown-item>
                <el-dropdown-item command="logout" divided>注销</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <router-link v-if="!info.username" to="/register">
            <el-button type="text" class="button">注册</el-button>
        </router-link>
        <router-link v-if="!info.username" to="/login">
            <el-button type="text" class="button">登录</el-button>
        </router-link>
        <el-button v-show="backShow" size="small" class="back-button" icon="el-icon-back" circle @click="handleBack"/>
    </el-menu>
</template>

<script>
import ColorPicker from '@oj/components/ColorPicker'
import { mapActions, mapState } from 'vuex'
import userAPI from '@oj/api/oj.user'

export default {
  name: 'NavBar',
  components: { ColorPicker },
  computed: {
    ...mapState('oj/user', [
      'info'
    ])
  },
  data () {
    return {
      isAdmin: false,
      backShow: false
    }
  },
  mounted () {
    this.isAdmin = this.info.type !== '1'
  },
  watch: {
    $route (now) {
      this.backShow = !(now.path === '/' || now.path === '/home')
    }
  },
  methods: {
    ...mapActions('oj/account', [
      'logout'
    ]),
    handleSticky (data) {
      console.log(data)
    },
    handleClick () {
      this.$router.push({
        name: 'user',
        params: { username: this.info.username }
      })
    },
    handleCommand (command) {
      if (command === 'logout') {
        this.logout()
      }
      if (command === 'home') {
        this.$router.push({
          name: 'user',
          params: { username: this.info.username }
        })
      }
      if (command === 'submit') {
        this.$router.push({
          name: 'status',
          params: { username: this.info.username }
        })
      }
      if (command === 'updateRanking') {
        userAPI.updateRanking().then(res => {
          this.$message({
            message: '更新成功，当前排名' + (res + 1),
            type: 'success'
          })
        }
        )
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
        /*min-width: 1100px;*/
        z-index: 888;
        width: 100%;
        height: 60px;
        box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
    }

    .logo {
        width: 100px;
        height: 55px;
        /*margin-bottom: 8px;*/
    }

    .icon-color {
        color: #608290;
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
