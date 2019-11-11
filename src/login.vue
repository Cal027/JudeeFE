<template>
  <el-dialog title="登录" :visible.sync="dialogLoginVisible">
    <el-form :model="loginorm" @keyup.native.enter="loginClick">
      <el-form-item prop="username" label="用户名或邮箱">
        <el-input v-model="loginForm.username" :autofocus="true"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input type="password" v-model="loginForm.password"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogLoginVisible = false">取消</el-button>
      <el-button type="primary" @click="loginClick">确认</el-button>
    </div>
  </el-dialog>
</template>
F
<script>
    export default {
        name: "login",
        data() {
            return {
                dialogLoginVisible: false,
                loginForm: {
                    username: "",
                    password: ""
                }
            };
        },
        methods: {
            open() {
                this.dialogLoginVisible = true;
            },
            loginClick() {
                var pas = this.$md5(this.loginForm.password);
                this.$axios
                    .post("/login/", {
                        username: this.loginForm.username,
                        password: pas
                    })
                    .then(response => {
                        if (response.data === "pwdError") {
                            this.$message.error("密码错误");
                            return;
                        }
                        this.$message({
                            message: "登录成功！",
                            type: "success"
                        });

                        sessionStorage.setItem("username", this.loginForm.username);
                        sessionStorage.setItem("name", response.data.name);
                        sessionStorage.setItem("type", response.data.type);


                        this.dialogLoginVisible = false;
                        if (this.$store.state.loginip === "") {
                            this.$store.state.loginip = "chrome" // 后台会处理
                        }

                        this.$axios
                            .post("/setlogindata/", {
                                username: this.loginForm.username,
                                ip: this.$store.state.loginip,
                                msg: this.$store.state.logininfo
                            })
                            .then(response => {
                                this.$router.go(0);
                            })
                            .catch(error => {
                                this.$message.error(
                                    "服务器错误！" + "(" + JSON.stringify(error.response.data) + ")"
                                );
                                sessionStorage.setItem("username", "");
                                sessionStorage.setItem("name", "");
                                sessionStorage.setItem("rating", "");
                                sessionStorage.setItem("type", "");
                                sessionStorage.setItem("ac_prob", "");
                            });
                    })
                    .catch(error => {
                        this.$message.error("用户名不存在（" + error + "）");
                    });
            }
        }
    };
</script>

<style scoped>

</style>
