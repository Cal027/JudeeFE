<template>
    <el-card class="module">
        <el-table
                v-loading="loading"
                element-loading-text="正在加载"
                class="table"
                ref="table"
                :data="tableData"
                style="width: 100%">
            <el-table-column label="#" sortable width="80">
                <template slot-scope="scope">
                    {{toLetter(scope.$index+1)}}
                </template>
            </el-table-column>
            <el-table-column prop="title" label="标题">
                <template slot-scope="scope">
                    <router-link :to="{name: 'Contest-problem-detail',params: {contestID: contestID,id: scope.row.ID}}">
                        {{scope.row.title}}
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column prop="rate" label="通过率" width="100"/>
            <el-table-column prop="accepted_number" label="通过人数" width="100"/>
            <el-table-column prop="submission_number" label="提交人数" width="100"/>
            <el-table-column prop="total_score" label="分数" width="100"/>
            <el-table-column prop="contestproblem__first_ac" label="First Blood" width="100"/>
        </el-table>
    </el-card>
</template>

<script>
import problemAPI from '@oj/api/oj.problem'
import util from '@/utils/util'

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
        console.log(res)
        for (let i = 0; i < res.length; i++) {
          let ac = res[i]['accepted_number']
          let sub = res[i]['submission_number']
          res[i]['rate'] = (sub === 0 ? '0.00' : Math.round(ac / sub * 10000) / 100.00) + '%'
        }
        this.tableData = res
        this.loading = false
      })
    },
    toLetter (index) {
      return util.formatter.toLetter(index)
    }
  },
  mounted () {
    this.contestID = this.$route.params.contestID
    this.getContestProblems()
  }
}
</script>

<style scoped lang="less">
    .module {
        width: 80%;
        padding: 30px 50px;
        margin: 0 auto 20px;
    }

    .table {

    a {
        color: #0078D7;
        text-decoration: none;
    }

    .router-link-active {
        color: #0078D7;
        text-decoration: none;
    }

    }
</style>
