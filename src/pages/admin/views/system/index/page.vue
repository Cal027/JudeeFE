<template>
    <d2-container class="page">
      <el-card class="logo">
        <el-image src="image/logo2.png"></el-image>
      </el-card>
        <div class="te">
            <span>Judee OJ后台管理面板</span>
        </div>
    </d2-container>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      filename: __filename
    }
  }
}
</script>

<style lang="scss" scoped>
    .logo {
      width: 600px;
      text-align: center;
      margin: 10%  auto;
    }
    .te{
        margin-top: -7%;
        text-align: center;
        font-weight: 350;
        font-size: 18px;
    }
</style>
