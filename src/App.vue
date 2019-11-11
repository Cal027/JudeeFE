<template>
  <div id="app">
    <el-menu :default-active="activeIndex" mode="horizontal" :router="true" id="nav"
    :class="[navFixed? 'navWrap':'']">
      <el-menu-item index="/" id="title">{{school}}</el-menu-item>
      <el-menu-item index="/main">
        <i class="el-icon-data-board"></i>首页
      </el-menu-item>
      <el-menu-item index="/problem">
        <i class="el-icon-tickets"></i>题库
      </el-menu-item>
      <el-menu-item index="/statue">
        <i class="el-icon-tickets"></i>评测记录
      </el-menu-item>
      <el-menu-item index="/contest">
        <i class="el-icon-trophy"></i>比赛
      </el-menu-item>
      <el-menu-item index="/rank">
        <i class="el-icon-star-on"></i>排名
      </el-menu-item>
      <el-menu-item index="/wiki">
        <i class="el-icon-star-off"></i>Wiki
      </el-menu-item>
      <el-menu-item index="/todolist">
        <i class="el-icon-s-promotion"></i>待办事项
      </el-menu-item>

      <el-button round id="button" @click="registeropen" v-show="!loginshow">注册</el-button>
      <el-button round id="button" @click="loginopen" v-show="!loginshow">登录</el-button>

      <el-dropdown
        id="user"
        v-show="loginshow"
        @command="handleCommand"
        :show-timeout="100"
        :split-button="true"
      >
        <span class="el-dropdown-link">Welcome {{name}}</span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="home">Home</el-dropdown-item>
          <el-dropdown-item command="submittion">Submittion</el-dropdown-item>
          <el-dropdown-item command="setting">Setting</el-dropdown-item>
          <el-dropdown-item command="admin" divided v-show="isadmin">Admin</el-dropdown-item>
          <el-dropdown-item command="logout" divided>Logout</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-menu>

    <register ref="registerdialog"></register>

    <login ref="logindialog"></login>

    <el-backtop :bottom="50">
      <div
        style="{
        height: 100%;
        width: 100%;
        background-color: #f2f5f6;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
      }"
      >UP
      </div>
    </el-backtop>

    <transition name="el-fade-in-linear" mode="out-in">
      <router-view id="route"></router-view>
    </transition>
  </div>
</template>

<script>
    import login from "@/login";
    import register from "@/register";


    export default {
        name: "App",
        components: {
            login,
            register
        },
        data() {
            return {
                activeIndex: "1",
                school: "Judee",
                loginshow: sessionStorage.username,
                username: sessionStorage.username,
                name: sessionStorage.name,
                isadmin: false,
                navFixed: false
            };
        },
        mounted() {
            window.addEventListener('scroll', this.watchScroll);
            this.isadmin = sessionStorage.type === 2 || sessionStorage.type === 3;
            this.$axios
                .get("/dashboard/")
                .then(res => {
                    if (res.data.length > 0) this.school = res.data[0].ojname;
                    else this.school = "Judee";
                })
                .catch(error => {
                    this.$message.error(
                        "服务器错误！" + "(" + JSON.stringify(error.response.data) + ")"
                    );
                });
        },
        methods: {
            watchScroll() {
                var scrollTop = window.pageXOffset || document.documentElement.scrollTop || document.body.scrollTop;
                this.navFixed = scrollTop > 0;
            },
            loginopen() {
                this.$refs.logindialog.open();
            },
            registeropen() {
                this.$refs.registerdialog.open();
            },
            handleCommand(command) {
                if (command === "logout") {
                    this.$axios
                        .get("/logout/")
                        .then(response => {
                            this.$message({
                                message: "登出成功！",
                                type: "success"
                            });
                            sessionStorage.setItem("username", "");
                            sessionStorage.setItem("name", "");
                            sessionStorage.setItem("rating", "");
                            sessionStorage.setItem("type", "");
                            this.loginshow = 0;
                            this.username = "";
                            this.$router.go(0);
                        })
                        .catch(error => {
                            this.$message.error(
                                "服务器错误！" + "(" + JSON.stringify(error.response.data) + ")"
                            );
                        });
                }
                if (command === "home") {
                    this.$router.push({
                        name: "user",
                        query: {username: sessionStorage.username}
                    });
                }
                if (command === "setting") {
                    this.$router.push({
                        name: "setting",
                        params: {username: sessionStorage.username}
                    });
                }
                if (command === "submittion") {
                    this.$router.push({
                        name: "statue",
                        query: {username: sessionStorage.username}
                    });
                }
                if (command === "admin") {
                    this.$router.push({
                        name: "admin"
                    });
                }
            }
        }
    };
</script>

<style scoped>
  .el-dropdown-link {
    cursor: pointer;
    color: #409eff;
  }

  #button {
    float: right;
    margin: 10px;
  }

  #user {
    float: right;
    margin: 10px;
  }

  #nav {
    background-color: #ffffff;
    /*position: relative;*/
    left: 0;
    top: 0;
    z-index: 5;
    width: 100%;
  }

  .navWrap {
    position: fixed;
    top: 0;
    z-index: 999;
  }

  #route {
    position: relative;
    top: 10px;
  }

  #title {
    font-size: 20px;
    font-weight: bold;
  }


</style>
