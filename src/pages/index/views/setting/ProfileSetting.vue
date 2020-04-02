<template>
    <el-container>
        <SquareBackground/>
        <el-header>
            <h1>修改个人信息</h1>
        </el-header>
        <el-main style="z-index: 10">
            <el-card id="card">
                <el-form ref="form" :model="form" :rules="rules">
                    <el-form-item prop="nickname" label="昵称">
                        <el-input v-model="form.nickname"/>
                    </el-form-item>

                    <el-form-item prop="desc" label="个人介绍">
                        <el-input v-model="form.desc"
                                  placeholder="你这个人很懒，什么都没有留下"/>
                    </el-form-item>

                    <el-form-item prop="phone_number" label="电话号码">
                        <el-input v-model="form.phone_number"
                                  placeholder="还没留下电话号码"/>
                    </el-form-item>

                    <el-form-item prop="qq_number" label="QQ">
                        <el-input v-model="form.qq_number" placeholder="还没留下QQ号码"/>
                    </el-form-item>

                    <el-form-item prop="github" label="Github用户名">
                        <el-input v-model="form.github_username" placeholder="还没留下Github用户名"/>
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
  name: 'ProfileSetting',
  components: { SquareBackground },
  data () {
    const checkQQ = (rule, value, callback) => {
      const qqPattern = /^[1-9][0-9]{4,10}$/
      setTimeout(() => {
        if (qqPattern.test(value) || !value) {
          callback()
        } else {
          callback(new Error('非法QQ号码'))
        }
      }, 100)
    }
    const checkPhone = (rule, value, callback) => {
      const pPattern = /^1[34578]\d{9}$/
      setTimeout(() => {
        if (pPattern.test(value) || !value) {
          callback()
        } else {
          callback(new Error('非法手机号码'))
        }
      }, 100)
    }
    return {
      username: '',
      form: {
        nickname: '',
        desc: '',
        qq_number: null,
        phone_number: null,
        github_username: null
      },
      rules: {
        nickname: [
          { min: 3, max: 16, message: '长度在 3 到 8 个字符', trigger: 'blur' },
          { required: true, message: '请输入昵称', trigger: 'blur' }],
        qq_number: { validator: checkQQ, trigger: 'blur' },
        phone_number: { validator: checkPhone, trigger: 'blur' }
      }
    }
  },
  mounted () {
    this.$store.dispatch('oj/user/getProfile').then(res => {
      this.username = res.username
      this.form.nickname = res.nickname
      this.form.desc = res.desc
      this.form.qq_number = res.qq_number
      this.form.phone_number = res.phone_number
      this.form.github_username = res.github_username
    }).catch(() => {
      this.$message.error('获取个人信息失败')
    })
  },
  methods: {
    updateClick () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.username) {
            this.$message.error('非法访问！')
            return
          }
          this.$confirm(
            '确定更新吗?',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          ).then(() => {
            userAPI.updateUserProfile(this.username, this.form)
              .then(() => {
                this.$notify({
                  message: '修改个人信息成功！',
                  type: 'success'
                })
                this.$router.back()
              })
          })
        } else {
          this.$message.error('更新个人信息失败!')
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
        /*margin: 200px;*/
        /*padding: 200px;*/
        width: 448px;
    }

    .button {
        /*display: block;*/
        width: 100%;
        margin-top: 20px;
    }
</style>
