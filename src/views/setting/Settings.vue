<template>
  <el-container>
    <el-header>
      <h1>个人信息</h1>
    </el-header>
<!--    <el-aside width="250px">-->
<!--      <p>TEST</p>-->
<!--    </el-aside>-->
    <el-main>
      <el-card id="card">
        <el-form :model="form">
          <el-form-item prop="nickname" label="昵称">
            <el-input v-model="form.nickname"></el-input>
          </el-form-item>

          <el-form-item prop="des" label="个人介绍">
            <el-input v-model="form.des"></el-input>
          </el-form-item>

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

          <el-form-item prop="QQ" label="QQ">
            <el-input v-model="form.qq"></el-input>
          </el-form-item>
        </el-form>

        <el-button type="primary" @click="updateClick">更新</el-button>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
    export default {
        name: "Settings",
        data() {
            return {
                username: "",
                name: "",
                form: {
                    username: "",
                    password: "",
                    confirm: "",
                    nickname: "",
                    des: "这个人很懒，什么都没有没有留下。",
                    qq_number: "",
                    github_username: "",
                    email: ""
                },
                userid: -1
            };
        },
        methods: {
            updateClick() {
                if (!this.username) {
                    this.$message.error("非法访问！");
                    return;
                }
                if (
                    !this.form.name ||
                    !this.form.number ||
                    !this.form.realname ||
                    !this.form.qq ||
                    !this.form.email
                ) {
                    this.$message.error("字段不能为空！");
                    return;
                }
                if (this.form.password !== this.form.confirm) {
                    this.$message.error("两次密码不一致！");
                    return;
                }

                if (this.form.name.length < 2) {
                    this.$message.error("昵称太短！");
                    return;
                }

                if (!this.form.password) {
                    this.$message.error("请输入密码");
                    return;
                }

                if (this.form.password.length < 6) {
                    this.$message.error("密码太短！");
                    return;
                }

                if (this.form.des.length <= 0) {
                    this.form.des = "这个人很懒，什么都没有没有留下。"
                }

                this.$confirm(
                    "确定更新吗?",
                    "如果你在参与一场比赛，请勿更新你的【昵称】，会影响排行榜计算，后果自负！",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }
                ).then(() => {

                    this.form.password = this.$md5(this.form.password);
                    this.$axios
                        .put(
                            "/change/" +
                            this.userid +
                            "/",
                            this.form
                        )
                        .then(response => {
                            this.$axios
                                .put(
                                    "/userdata/" +
                                    this.userid +
                                    "/",
                                    this.form
                                )
                                .then(
                                    response => {
                                        this.$message({
                                            message: "更新成功！",
                                            type: "success"
                                        });
                                        sessionStorage.setItem("name", this.form.name);
                                        this.$router.push({
                                            name: "user",
                                            query: {username: this.form.username}
                                        });
                                    },
                                    response => {
                                        this.$message.error("更新失败（" + response + "）");
                                    }
                                );
                        });
                })


            }
        },
        created() {
            this.username = this.$route.params.username;
            this.form.username = this.username;
            if (this.username) {
                this.$axios
                    .get(
                        "/user/?username=" +
                        this.username
                    )
                    .then(response => {
                        this.form.nickname = response.data[0].nickname;
                        this.form.realname = response.data[0].realname;
                        this.form.qq = response.data[0].qq;
                        this.form.email = response.data[0].email;
                        this.userid = this.username;
                    });
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

  #card {
    /*margin: 200px;*/
    /*padding: 200px;*/
    width: 448px;
  }

</style>
