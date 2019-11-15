<template>
  <el-container>
    <el-header>
      <h1>登录Judee OJ</h1>
    </el-header>
    <el-main>
      <el-card class="login-box">
        <el-form :model="loginForm">
          <el-form-item prop="username" label="用户名或邮箱">
            <el-input v-model="loginForm.username" :autofocus="true"></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码">
            <el-input type="password" v-model="loginForm.password"></el-input>
          </el-form-item>
          <el-button type="primary" class="button" @click="loginClick">登 录</el-button>
        </el-form>
      </el-card>
      <p class="create-account">
        还没账号？
        <router-link to="/register">立即注册!</router-link>
      </p>
    </el-main>
  </el-container>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                loginForm: {
                    username: "",
                    password: ""
                }
            };
        },
        methods: {
            loginClick() {
                var pas = this.$md5(this.loginForm.password);
                this.$axios
                    .post("/login/", {
                        username: this.loginForm.username,
                        password: pas
                    })
                    .then(response => {
                        if (response.data === "userError") {
                            this.$message.error("用户名或邮箱未注册");
                            return;
                        }
                        if (response.data === "pwdError") {
                            this.$message.error("密码错误");
                            return;
                        }
                        this.$message({
                            message: "登录成功！",
                            type: "success"
                        });

                        sessionStorage.setItem("username", this.loginForm.username);
                        sessionStorage.setItem("nickname", response.data.nickname);
                        sessionStorage.setItem("type", response.data.type);


                        // if (this.$store.state.loginip === "") {
                        //     this.$store.state.loginip = "unknown" // 后台会处理
                        // }

                        this.$axios
                            .post("/setlogindata/", {
                                username: this.loginForm.username,
                                // ip: this.$store.state.loginip,
                                msg: this.$store.state.logininfo
                            })
                            .then(response => {
                                this.$router.push('/');
                                this.$router.go(0);
                            })
                            .catch(error => {
                                this.$message.error(
                                    "服务器错误！" + "(" + JSON.stringify(error.response.data) + ")"
                                );
                                sessionStorage.setItem("username", "");
                                sessionStorage.setItem("nickname", "");
                                sessionStorage.setItem("rating", "");
                                sessionStorage.setItem("type", "");
                                sessionStorage.setItem("ac_prob", "");
                            });
                    })
                // .catch(error => {
                //     this.$message.error("用户名不存在（" + error + "）");
                // });
            }
        }
    };
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
    padding: 15px 20px;
    text-align: center;
    border: 1px solid #d8dee2;
    border-radius: 3px;
  }
</style>
