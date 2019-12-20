<template>
    <div class="container">
        <el-card>
            <el-table v-if="ruleType==='ACM'"
                      :data="rankList"
                      border
                      style="width: 100%">
                <el-table-column
                        prop="user"
                        label="选手"
                        width="180">
                </el-table-column>
                <el-table-column prop="accepted_number" label="解题数" width="100"/>
                <el-table-column prop="total_time" label="总罚时">
                    <template slot-scope="scope">
                        {{resolveSecond(scope.row.total_time)}}
                    </template>
                </el-table-column>
                <el-table-column v-for="(item,index) in problems"
                                 prop="submission_info[item]"
                                 :key="index"
                                 :label="toLetter(index+1)">
                    <template slot-scope="scope"
                              v-if="scope.row.submission_info[item.ID] && scope.row.submission_info[item.ID].is_ac">
                        <span>
                            {{resolveSecond(scope.row.submission_info[item.ID].ac_time)}}
                        </span>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

    </div>
</template>

<script>
import contestAPI from '@oj/api/oj.contest'
import util from '@/utils/util'

export default {
  name: 'ContestRank',
  data () {
    return {
      ruleType: '',
      problems: [],
      rankList: [],
      problemToLetter: {}
    }
  },
  mounted () {
    // this.type = this.$route.params.id
    // console.log(this.type)
    contestAPI.getContestRankList(this.$route.params.contestID).then(res => {
      console.log(res)
      this.ruleType = res.rule_type
      this.problems = res.problems
      this.rankList = res.rank_list
    })
  },
  methods: {
    toLetter (index) {
      return util.formatter.toLetter(index)
    },
    resolveSecond (second) {
      return util.time.resolveSecond(second)
    }
  }
}

</script>

<style scoped>
    .container {
        margin: 0 auto;
        width: 90%;
    }
</style>
