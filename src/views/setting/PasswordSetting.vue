<template>
  <el-container>
    <el-header>
      <h1>修改密码</h1>
    </el-header>
    <el-main>
      <el-card id="card">
        <el-form :model="form">
          <el-form-item prop="des" label="密码">
            <el-input
              type="password"
              v-model="form.password"
              placeholder="不少于6个字符的密码">
            </el-input>
          </el-form-item>

          <el-form-item prop="confirm" label="确认密码">
            <el-input
              type="password"
              v-model="form.confirm"
              placeholder="再次输入密码">
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
            return {
                username: sessionStorage.username,
                avatarUrl: "../static/default.png",
                userid: -1,
                form: {
                    password: "",
                    confirm: "",
                },
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
                    this.form.password = this.$md5(this.form.password);

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
    /*margin: 200px;*/
    /*padding: 200px;*/
    width: 448px;
  }

  .button {
    display: block;
    width: 100%;
    margin-top: 35px;
  }
</style>
