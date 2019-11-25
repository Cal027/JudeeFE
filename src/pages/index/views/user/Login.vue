<template>
  <el-container>
    <el-header>
      <h1>登录Judee OJ</h1>
    </el-header>
    <el-main>
      <el-card class="login-box">
        <el-form :model="loginForm">
          <el-form-item prop="username" label="用户名或邮箱">
            <el-input v-model="loginForm.username" :autofocus="true"/>
          </el-form-item>
          <el-form-item prop="password" label="密码">
            <el-input v-model="loginForm.password" type="password"/>
          </el-form-item>
          <el-button type="primary" class="button" @click="loginClick">登 录</el-button>
        </el-form>
      </el-card>
      <div class="create-account">
        <el-row>
          还没账号？<router-link to="/register">立即注册!</router-link>
        </el-row>
        已经是管理员？<el-link href="admin">立即登录！</el-link>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    loginClick () {
      this.$api.user.login({
        username: this.loginForm.username,
        password: this.loginForm.password
      }).then(response => {
        if (response.data === 'userError') {
          this.$message.error('用户名或邮箱未注册')
          return
        }
        if (response.data === 'pwdError') {
          this.$message.error('密码错误')
          return
        }
        this.$message({
          message: '登录成功！',
          type: 'success'
        })
        localStorage.setItem('JWT_TOKEN', response.data.token)
        localStorage.setItem('username', response.data.username)
        localStorage.setItem('nickname', response.data.nickname)
        localStorage.setItem('type', response.data.type)
        localStorage.setItem('ac_prob', response.data.ac_prob)
        this.$api.user.setLoginData({
          username: this.loginForm.username,
          msg: this.$store.state.loginInfo
        }).then(response => {
          this.$router.push('/')
          this.$router.go(0)
        }).catch(error => {
          this.$message.error(
            '服务器错误！' + '(' + JSON.stringify(error.response.data) + ')'
          )
          localStorage.removeItem('JWT_TOKEN')
        })
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
</style>
