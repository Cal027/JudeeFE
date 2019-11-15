<template>
  <el-menu :default-active="activeIndex" mode="horizontal" :router="true" id="nav">
    <el-menu-item index="/" id="title">
      <el-image :src="logo_url" class="logo"></el-image>
    </el-menu-item>
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
    <router-link to="/register">
      <el-button round class="button">注册</el-button>
    </router-link>
    <router-link to="/login">
      <el-button round class="button">登录</el-button>
    </router-link>

    <el-dropdown
      id="user"
      v-show="loginshow"
      @command="handleCommand"
      :show-timeout="100"
      :split-button="true">
      <span class="el-dropdown-link">Welcome {{name}}</span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="home">Home</el-dropdown-item>
        <el-dropdown-item command="submittion">Submittion</el-dropdown-item>
        <el-dropdown-item command="setting">Setting</el-dropdown-item>
        <el-dropdown-item command="admin" divided v-show="isAdmin">Admin</el-dropdown-item>
        <el-dropdown-item command="logout" divided>Logout</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script>
    export default {
        name: "NavBar",
        data() {
            return {
                logo_url: '../static/logo2.png'
            };
        },
        methods: {
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
                            this.loginShow = 0;
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
    }
</script>

<style scoped>
  #nav {
    background-color: #ffffff;
    min-width: 1100px;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    width: 100%;
    height: 60px;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
  }

  .logo {
    width: 96px;
    height: 54px
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #409eff;
  }

  .button {
    float: right;
    margin: 10px;
  }

  #user {
    float: right;
    margin: 10px;
  }
</style>
