<template>
  <div id="app">
    <NavBar></NavBar>
    <el-backtop :bottom="50">
      <div
        style="{
        height: 100%;
        width: 100%;
        background-color: #f2f5f6;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: #1989fa;}">
        <i class="el-icon-top"></i>
      </div>
    </el-backtop>
    <div class="content">
      <transition name="el-fade-in-linear" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
    import NavBar from "./components/NavBar";

    export default {
        name: "App",
        components: {NavBar},
        data() {
            return {
                school: "Judee",
                isAdmin: false,
            };
        },
        mounted() {
            // this.isAdmin = sessionStorage.type === 2 || sessionStorage.type === 3;
            // this.$axios
            //     .get("/dashboard/")
            //     .then(res => {
            //         if (res.data.length > 0) this.school = res.data[0].ojname;
            //         else this.school = "Judee";
            //     })
            //     .catch(error => {
            //         this.$message.error(
            //             "服务器错误！" + "(" + JSON.stringify(error.response.data) + ")"
            //         );
            //     });
        }
    };
</script>

<style scoped>
  .el-dropdown-link {
    cursor: pointer;
    color: #409eff;
  }

  .content {
    margin-top: 80px;
    padding: 0 2%;
  }
</style>
