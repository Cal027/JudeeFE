<template>
  <el-container>
    <el-header>
      <h1>Judee Tutorial</h1>
    </el-header>
    <el-main>
      <el-row type="flex" justify="space-around" style="margin-bottom: 20px">
        <el-col :span="8">
          <el-card>
            <div slot="header">
              <b>算法教程</b>
            </div>
            <div style=" margin-bottom: 18px;">来自Oi-Wiki的算法教程</div>
            <div style=" margin-bottom: 5px;">
              <el-button type="primary" @click="glClick">查看教程</el-button>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>
            <div slot="header">
              <b>算法模板</b>
            </div>
            <div style=" margin-bottom: 18px;">在这里你可以保存自己的模板</div>
            <div style=" margin-bottom: 18px;">在这里你可以查看别人编写的模板</div>
            <div style=" margin-bottom: 5px;">
              <el-button type="primary" @click="mbClick">查看模板</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'Tutorial',
  data () {
    return {}
  },
  methods: {
    glClick () {
      this.$router.push({
        name: 'OiWiki'
      })
    },
    mbClick () {
      this.$message.error('还没实现')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-header h1 {
    text-align: center;
    font-size: 24px;
    font-weight: 300;
    letter-spacing: -.5px;
  }

  .el-main {
    text-align: center;
    width: 75%;
    margin: 0 auto;
  }
</style>
