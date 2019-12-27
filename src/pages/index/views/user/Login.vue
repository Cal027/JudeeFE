<template>
    <el-container>
        <SquareBackground/>
        <el-header>
            <h1>登录Judee OJ</h1>
        </el-header>
        <el-main style="z-index: 10">
            <el-card class="login-box">
                <el-form :model="loginForm">
                    <el-form-item prop="username" label="用户名或邮箱">
                        <el-input v-model="loginForm.username" :autofocus="true"/>
                    </el-form-item>
                    <el-form-item prop="password" label="密码">
                        <el-input v-model="loginForm.password" show-password/>
                    </el-form-item>
                    <el-button type="primary" class="button" @click="loginClick">登 录</el-button>
                </el-form>
            </el-card>
            <div class="create-account">
                <el-row>
                    <router-link to="/register">
                        <el-link>
                            还没账号？立即注册!
                        </el-link>
                    </router-link>
                </el-row>
                <el-link href="admin.html" target="_blank">已经是管理员？立即登录！</el-link>
            </div>
        </el-main>
    </el-container>
</template>

<script>
import SquareBackground from '@oj/components/SquareBackground'
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  components: { SquareBackground },
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    ...mapActions('oj/account', [
      'login'
    ]),
    loginClick () {
      this.login({
        username: this.loginForm.username,
        password: this.loginForm.password
      }).then(() => {
        this.$message({
          message: '登录成功！返回之前页面',
          type: 'success'
        })
        this.$router.replace(this.$route.query.redirect || '/')
      })
    }
  }
}
</script>

<style scoped>
    .el-header h1 {
        text-align: center;
        font-size: 24px;
        font-weight: 300;
        letter-spacing: -.5px;
    }

    .el-main {
        text-align: center;
        margin: 0 auto;
    }

    .button {
        display: block;
        width: 100%;
        margin-top: 35px;
    }

    .login-box {
        width: 448px;
    }

    .create-account {
        margin-top: 20px;
        padding: 15px 20px;
        text-align: center;
        border: 1px solid #d8dee2;
        border-radius: 3px;
    }

    .el-link {
        font-size: 16px;
    }

    a {
        text-decoration: none;
    }
</style>
