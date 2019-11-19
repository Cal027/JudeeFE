<template>
  <el-container>
    <el-header>
      <h1>修改密码</h1>
    </el-header>
    <el-main>
      <el-card id="card">
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item prop="pass" label="当前密码">
            <el-input
              type="password"
              v-model="form.password"
              placeholder="请输入当前密码">
            </el-input>
          </el-form-item>

          <el-form-item prop="newPass" label="新密码">
            <el-input
              type="password"
              v-model="form.new_password"
              placeholder="不少于6个字符的新密码">
            </el-input>
          </el-form-item>

          <el-form-item prop="Confirm" label="确认新密码">
            <el-input
              type="password"
              v-model="form.confirm"
              placeholder="请再次输入密码">
            </el-input>
          </el-form-item>
        </el-form>
        <el-button class="button" type="primary" @click="updateClick">更新</el-button>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
    export default {
        name: "PasswordSetting",
        data() {
            var checkPass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('密码不能为空'));
                } else if (value.length < 6) {
                    callback(new Error('密码不能少于6字符'));
                } else {
                    if (this.form.confirm !== '') {
                        this.$refs.form.validateField('Confirm');
                    }
                    callback();
                }
            };
            var checkConfirm = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.form.new_password) {
                    callback(new Error('两次输入密码不一致!'))
                } else {
                    callback()
                }
            };
            return {
                username: sessionStorage.username,
                form: {
                    password: "",
                    new_password: "",
                    confirm: "",
                },
                rules: {
                    newPass: {validator: checkPass, trigger: 'blur'},
                    Confirm: {validator: checkConfirm, trigger: 'blur'},
                }
            };
        },
        methods: {
            updateClick() {
                if (!this.username) {
                    this.$message.error("非法访问！");
                    return;
                }
                if (this.form.password !== this.form.confirm) {
                    this.$message.error("两次密码不一致！");
                    return;
                }
                if (this.form.password && this.form.password.length < 6) {
                    this.$message.error("密码太短！");
                    return;
                }

                this.$confirm(
                    "确定更新吗?",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }
                ).then(() => {
                    // TODO 未处理修改密码API
                    now = this.$md5(this.form.password);
                })
            }
        },
        created() {
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
