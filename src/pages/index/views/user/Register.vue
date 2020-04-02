<template>
  <el-container>
    <SquareBackground/>
    <el-header>
      <h1>加入Judee OJ</h1>
    </el-header>
    <el-main style="z-index: 10">
      <span>我们使用 Gravatar 服务来呈现您的头像</span>
      <el-card class="reg-box">
        <el-form ref="regForm"
                 :model="regForm"
                 :hide-required-asterisk="true" :rules="rules"
                 status-icon
                 @keyup.native.enter="registerClick">

          <el-form-item prop="email" label="Email">
            <el-input v-model="regForm.email" type="email" placeholder="abc@example.com"/>
          </el-form-item>

          <el-form-item prop="username" label="用户名">
            <el-input v-model="regForm.username" placeholder="不少于3个字符的用户名"/>
          </el-form-item>

          <el-form-item prop="nickname" label="昵称">
            <el-input v-model="regForm.nickname" placeholder="不少于1个字符的昵称"/>
          </el-form-item>

          <el-form-item prop="password" label="密码">
            <el-input
              v-model="regForm.password"
              show-password
              placeholder="不少于6个字符的密码"
            />
          </el-form-item>

          <el-form-item prop="confirm" label="确认密码">
            <el-input
              v-model="regForm.confirm"
              show-password
              placeholder="再次输入密码"/>
          </el-form-item>
        </el-form>
        <el-row>
          <el-button class="butt" @click="resetForm">重 置</el-button>
        </el-row>
        <el-row>
          <el-button type="primary" class="butt" @click="registerClick">注 册</el-button>
        </el-row>
      </el-card>
      <p class="signin">
        已有账号？
        <router-link to="/login">立即登录!</router-link>
      </p>
    </el-main>
  </el-container>
</template>

<script>
import SquareBackground from '@oj/components/SquareBackground'
import userAPI from '@oj/api/oj.user'

export default {
  name: 'Register',
  components: { SquareBackground },
  data () {
    // 正则表达式校验
    const checkUserName = (rule, value, callback) => {
      const uPattern = /^[a-zA-Z0-9_-]{3,16}$/
      if (!value) {
        return callback(new Error('用户名不能为空'))
      }
      setTimeout(() => {
        if (uPattern.test(value)) {
          callback()
        } else {
          callback(new Error('非法用户名'))
        }
      }, 100)
    }
    const checkPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('密码不能为空'))
      } else if (value.length < 6) {
        callback(new Error('密码不能少于6字符'))
      } else {
        if (this.regForm.confirm !== '') {
          this.$refs.regForm.validateField('confirm')
        }
        callback()
      }
    }
    const checkConfirm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.regForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      regForm: {
        username: '',
        password: '',
        confirm: '',
        nickname: '',
        email: ''
      },
      rules: {
        email: [{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }],
        username: { validator: checkUserName, trigger: 'blur' },
        password: { validator: checkPass, trigger: 'blur' },
        confirm: { validator: checkConfirm, trigger: 'blur' },
        nickname: [
          { min: 3, max: 16, message: '长度在 3 到 8 个字符', trigger: 'blur' },
          { required: true, message: '请输入昵称', trigger: 'blur' }]
      }
    }
  },
  methods: {
    registerClick () {
      this.$refs.regForm.validate((valid) => {
        if (valid) {
          userAPI.register({
            username: this.regForm.username,
            password: this.regForm.password,
            nickname: this.regForm.nickname,
            email: this.regForm.email
          }).then(res => {
            if (res === 'userError') {
              this.$message.error('用户名已存在！')
              return
            }
            if (res === 'emailError') {
              this.$message.error('邮箱已存在！')
              return
            }
            this.$message({
              message: '注册成功！',
              type: 'success'
            })
            this.resetForm()
            this.$router.push('/login')
          })
        } else {
          this.$message.error('注册失败!')
          return false
        }
      })
    },
    resetForm () {
      this.$refs.regForm.resetFields()
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

  .el-main span{
    text-align: center;
    font-size: 16px;
    font-weight: 300;
    letter-spacing: -.5px;
  }

  .el-row{
    margin-bottom: 20px;
  }

  .el-main {
    text-align: center;
    margin: 0 auto;
  }

  .reg-box {
    width: 448px;
  }

  .butt {
    width: 100%;
  }

  .signin {
    padding: 15px 20px;
    text-align: center;
    border: 1px solid #d8dee2;
    border-radius: 3px;
  }
</style>
