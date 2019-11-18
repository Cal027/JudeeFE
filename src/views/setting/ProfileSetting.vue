<template>
  <el-container>
    <el-header>
      <h1>修改个人信息</h1>
    </el-header>
    <el-main>
      <el-card id="card">
        <el-form :model="form">
          <el-form-item prop="nickname" label="昵称">
            <el-input v-model="form.nickname"></el-input>
          </el-form-item>

          <el-form-item prop="desc" label="个人介绍">
            <el-input v-model="form.desc"
                      placeholder="你这个人很懒，什么都没有没有留下">
            </el-input>
          </el-form-item>

          <el-form-item prop="phone" label="电话号码">
            <el-input v-model="form.phone_number"
                      placeholder="还没留下电话号码">
            </el-input>
          </el-form-item>

          <el-form-item prop="qq" label="QQ">
            <el-input v-model="form.qq_number" placeholder="还没留下QQ号码"></el-input>
          </el-form-item>

          <el-form-item prop="github" label="Github用户名">
            <el-input v-model="form.github_username" placeholder="还没留下Github用户名"></el-input>
          </el-form-item>
        </el-form>

        <el-button class="button" type="primary" @click="updateClick">更新</el-button>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
    export default {
        name: "ProfileSetting",
        data() {
            return {
                username: sessionStorage.username,
                avatarUrl: "../static/default.png",
                form: {
                    nickname: "",
                    desc: "",
                    qq_number: "",
                    phone_number: "",
                    github_username: "",
                },
            };
        },

        methods: {
            updateClick() {
                if (!this.username) {
                    this.$message.error("非法访问！");
                    return;
                }
                if (this.form.nickname.length < 2) {
                    this.$message.error("昵称太短！");
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
                    // sessionStorage.setItem("user_id",)
                    this.$api.user.updateUserProfile(this.username, this.form)
                        .then(response => {
                            console.log(response.data);
                            if (response.data === '200') {
                                this.$message({
                                    message: "修改个人信息成功！",
                                    type: "success"
                                });
                                this.$router.go(0);
                            } else {
                                this.$message.error("修改个人信息失败！");
                            }
                        });
                })
            }
        },
        created() {
            if (this.username) {
                this.$api.user.getUserInfo(this.username).then(response => {
                    this.form.qq_number = response.data.qq_number;
                    this.form.desc = response.data.desc;
                    this.form.nickname = response.data.nickname;
                    this.form.phone_number = response.data.phone_number;
                });
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
    display: block;
    width: 100%;
    margin-top: 35px;
  }
</style>
