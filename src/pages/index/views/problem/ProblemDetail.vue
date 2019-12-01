<template>
    <el-container>
        <el-header>Header</el-header>
        <el-main>
            <el-card class="box-card" shadow="hover" >
                <div slot="header" class="clearfix">
                    <span>题目描述</span>
                    <el-input
                            type="textarea"
                            :rows="2"
                            disabled
                            v-model="problemDetail.input_description">
                    </el-input>
                </div>
            </el-card>
            <el-card class="box-card" shadow="hover" >
                <div class="clearfix">
                    <span>输入描述</span>
                </div>
                <div class="clearfix">
                    <span>输出描述</span>
                </div>
                <div v-for="(sample, index) in problemDetail.samples" :key="index" class="text item">
                    {{index+1}}
                </div>
            </el-card>
        </el-main>
    </el-container>
</template>

<script>
export default {
  name: 'ProblemDetail',
  data () {
    return {
      problemDetail: null
    }
  },
  methods: {
    getProblem (id) {
      this.$api.problem.getProblem(id)
        .then(response => {
          this.problemDetail = response.data
        })
    }
  },
  mounted () {
    if (this.$route.params.problemDetail && this.$route.params.problemDetail.ID === this.$route.params.id) {
      this.problemDetail = this.$route.params.problemDetail
    } else {
      this.getProblem(this.$route.params.id)
    }
  }

}
</script>

<style scoped>
    .text {
        font-size: 14px;
    }

    .item {
        margin-bottom: 18px;
    }
    .clearfix:before,

    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }

    .box-card {
        width: 480px;
        border-radius: 4px;
    }
</style>
