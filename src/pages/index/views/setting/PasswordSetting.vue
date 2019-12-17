<template>
  <el-container>
    <SquareBackground/>
    <el-header>
      <h1>修改密码</h1>
    </el-header>
    <el-main>
      <el-card id="card">
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item prop="pass" label="当前密码">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入当前密码"/>
          </el-form-item>

          <el-form-item prop="new_password" label="新密码">
            <el-input
              v-model="form.new_password"
              type="password"
              placeholder="不少于6个字符的新密码"/>
          </el-form-item>

          <el-form-item prop="confirm" label="确认新密码">
            <el-input
              v-model="form.confirm"
              type="password"
              placeholder="请再次输入密码"/>
          </el-form-item>
        </el-form>
        <el-button class="button" type="primary" @click="updateClick">更新</el-button>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
import SquareBackground from '@oj/components/SquareBackground'
import userAPI from '@oj/api/oj.user'

export default {
  name: 'PasswordSetting',
  components: { SquareBackground },
  data () {
    var checkNewPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('密码不能为空'))
      } else if (value.length < 6) {
        callback(new Error('密码不能少于6字符'))
      } else if (value === this.form.password) {
        callback(new Error('新密码不能和原密码一致'))
      } else {
        if (this.form.confirm !== '') {
          this.$refs.form.validateField('confirm')
        }
        callback()
      }
    }
    var checkConfirm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.new_password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      form: {
        password: '',
        new_password: '',
        confirm: ''
      },
      rules: {
        new_password: { validator: checkNewPass, trigger: 'blur' },
        confirm: { validator: checkConfirm, trigger: 'blur' }
      }
    }
  },
  methods: {
    updateClick () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm(
            '确定更新吗?',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          ).then(() => {
            userAPI.changePwd({
              password: this.form.password,
              new_password: this.form.new_password
            }).then(res => {
              if (res === 'userError') {
                this.$message.error('非法访问！')
                return
              }
              if (res === 'pwdError') {
                this.$message.error('原密码不一致！')
                return
              }
              this.$message({
                message: '修改密码成功！',
                type: 'success'
              })
              this.$router.back()
            })
          })
        } else {
          this.$message.error('修改密码失败')
          return false
        }
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

  #card {
    width: 448px;
  }

  .button {
    display: block;
    width: 100%;
    margin-top: 35px;
  }
</style>
