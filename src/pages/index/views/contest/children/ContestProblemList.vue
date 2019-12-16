<template>
    <el-card class="module">
        <el-table
                v-loading="loading"
                element-loading-text="正在加载"
                ref="table"
                @row-click="goContestProblem"
                :data="tableData"
                style="width: 100%">
            <el-table-column prop="contestproblem__name" label="#" sortable :width="80"/>
            <el-table-column prop="title" label="标题"/>
            <el-table-column prop="rate" label="正确率"  :width="100"/>
            <el-table-column prop="accepted_number" label="正确数" :width="100"/>
            <el-table-column prop="submission_number" label="提交数" :width="100"/>
            <el-table-column prop="total_score" label="分数" :width="100"/>
            <el-table-column prop="contestproblem__first_ac" label="First Blood" :width="100"/>
        </el-table>
    </el-card>
</template>

<script>
import problemAPI from '@oj/api/oj.problem'

export default {
  name: 'ContestProblemList',
  data () {
    return {
      loading: false,
      tableData: [],
      contestID: ''
    }
  },
  methods: {
    getContestProblems () {
      this.loading = true
      problemAPI.getContestProblems(this.contestID).then(res => {
        for (let i = 0; i < res.length; i++) {
          let ac = res[i]['accepted_number']
          let sub = res[i]['submission_number']
          res[i]['rate'] = (sub === 0 ? '0.00' : Math.round(ac / sub * 10000) / 100.00) + '%'
        }
        this.tableData = res
        this.loading = false
      })
    },
    goContestProblem (row) {
      this.$router.push({
        name: 'Contest-problem-detail',
        params: {
          contestID: this.contestID,
          id: row.ID
        }
      })
    }
  },
  mounted () {
    this.contestID = this.$route.params.contestID
    this.getContestProblems()
  }
}
</script>

<style scoped>
    .module {
        width: 80%;
        padding: 30px 50px;
        margin: 0 auto 20px;
    }
</style>
