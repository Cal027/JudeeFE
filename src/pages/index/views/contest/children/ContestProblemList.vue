<template>
    <el-card class="card-module">
        <el-table
                v-loading="loading"
                element-loading-text="正在加载"
                class="table"
                ref="table"
                :header-cell-style="{background: '#E5E9F0'}"
                :data="tableData"
                style="width: 100%">
            <el-table-column label="#" width="80">
                <template v-slot="scope">
                    {{toLetter(scope.$index+1)}}
                </template>
            </el-table-column>
            <el-table-column prop="title" label="标题">
                <template v-slot="scope">
                    <router-link :to="{name: 'Contest-problem-detail',params: {contestID: contestID,id: scope.row.ID}}">
                        {{scope.row.title}}
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column prop="rate" label="通过率" width="100"/>
            <el-table-column prop="accepted_number" label="通过人数" width="100"/>
            <el-table-column prop="submission_number" label="提交人数" width="100"/>
            <el-table-column prop="total_score" label="分数" width="100"/>
            <el-table-column v-if="contestDetail.rule_type==='ACM'" prop="contestproblem__first_ac" label="First Blood" width="100"/>
        </el-table>
    </el-card>
</template>

<script>
import problemAPI from '@oj/api/oj.problem'
import util from '@/utils/util'
import { mapState } from 'vuex'

export default {
  name: 'ContestProblemList',
  computed: {
    ...mapState('oj/contest', ['contestDetail'])
  },
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
          const ac = res[i].accepted_number
          const sub = res[i].submission_number
          res[i].rate = (sub === 0 ? '0.00' : Math.round(ac / sub * 10000) / 100.00) + '%'
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
    .table {

        a {
            color: #76a3cd;
            text-decoration: none;
        }

        .router-link-active {
            color: #76a3cd;
            text-decoration: none;
        }

    }
</style>
