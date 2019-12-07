<template>
    <d2-container type="ghost">
        <div :class="isSticky? 'float': 'nav'"
             :style="{'margin-top':top+'px','border-bottom': themeColor +' solid','border-width':'2px'}"
             v-sticky on-stick="handleSticky" sticky-offset="{top:-44}">
            <div class="header">
                <span style="font-size: 24px">{{contestDetail.title}}</span>
            </div>
            <el-menu
                    :default-active="activeIndex"
                    mode="horizontal"
                    text-color="#1b153b"
                    class="menu"
                    background-color="transparent">
                <el-menu-item index="1" class="menuItem">首页</el-menu-item>
                <el-menu-item index="2" class="menuItem">问题列表</el-menu-item>
                <el-menu-item index="3" class="menuItem">我的提交</el-menu-item>
                <el-menu-item index="4" class="menuItem">所有提交</el-menu-item>
                <el-menu-item index="5" class="menuItem">排名</el-menu-item>
                <el-menu-item index="6" class="menuItem">公告</el-menu-item>
            </el-menu>
        </div>

    </d2-container>
</template>

<script>
export default {
  name: 'ContestDetail',
  data () {
    return {
      themeColor: '',
      contest: '',
      contestDetail: { title: 'Judee OJ 模拟赛1' },
      activeIndex: '1',
      top: -10,
      isSticky: false
    }
  },
  async created () {
    // 异步加载当前主题色
    this.themeColor = await this.$store.dispatch('oj/db/get', {
      dbName: 'sys',
      path: 'color.value',
      defaultValue: process.env.VUE_APP_ELEMENT_COLOR,
      user: true
    })
  }
}
</script>

<style scoped>
    .online {
        display: block;
        height: 2px;
        width: 100%;
        margin: -1.5px 0 0;
    }

    .nav {
        padding: 10px 50px 0 50px;
        width: 80% !important;
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        margin: 0 auto 20px;
    }

    .float {
        padding: 10px 80px 0;
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
    }

    .el-menu-item {
        height: 55px;
        margin-top: -5px;
    }

    .title {
        font-size: 20px;
        font-weight: 400;
        margin: 25px 0 8px;
        /*color: #3091f2*/
    }

    .menu {
        border-bottom: none;
    }

    .menuItem:hover {
        background: #fff !important;
    }

    .menuItem {
        font-size: 16px;
    }
</style>
