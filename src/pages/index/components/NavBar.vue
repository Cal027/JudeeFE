<template>
    <el-menu :default-active="$route.path" text-color="#4C566A"
             background-color="#ECEFF4"
             router mode="horizontal" class="nav">
        <el-menu-item index="/">
            <d2-icon-svg name="logo" class="logo"/>
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
                <el-dropdown-item v-if="isAdmin" command="admin">管理</el-dropdown-item>
                <el-dropdown-item class="picker">
                    主题色
                    <ColorPicker/>
                </el-dropdown-item>
                <el-dropdown-item command="logout" divided>注销</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <el-avatar v-if="info.username" :src="info.avatarUrl" :size="35" class="avatar"/>
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
    ]),
    isAdmin: function () {
      return this.info.type !== 1
    }
  },
  data () {
    return {
      backShow: false
    }
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
    ...mapActions('oj/user', [
      'updateAC'
    ]),
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
      if (command === 'admin') {
        window.open('/admin')
      }
      if (command === 'updateRanking') {
        userAPI.updateRanking().then(res => {
          this.updateAC(res.ac_prob)
          this.$message({
            message: '更新成功，当前排名' + (res.ranking + 1),
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
        z-index: 888;
        width: 100%;
        position: fixed;
        top: 0;
        height: 60px;
        box-shadow: rgba(216, 222, 233, 0.15) 0 5px 10px 0;
    }

    .logo {
        width: 120px;
        height: 45px;
    }

    .icon-color {
        color: #4C566A;
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
        padding: 6px !important;
        font-size: 16px;
        background-color: transparent;
        margin-top: 16px;
        margin-right: 8px;
    }

    .user {
        float: right;
        margin: 10px;
    }

    .iconfont {
        font-size: 18px;
        margin-right: 5px
    }

    .avatar {
        float: right;
        margin-top: 13px;
        margin-right: 3px;
        box-shadow: 0 0 8px 0 rgba(232, 237, 250, .6), 0 2px 4px 0 rgba(232, 237, 250, .5);
    }
</style>

<style lang="less">
    .picker {
        .el-color-picker--mini .el-color-picker__trigger {
            filter: opacity(0);
            padding: 0;
            margin-bottom: -10px;
            margin-left: -65px;
            height: 30px;
            border: none;
            width: 90px;
        }
    }
</style>
