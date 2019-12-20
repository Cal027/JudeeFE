<template>
    <div class="container">
        <el-table v-if="ruleType==='ACM'"
                :data="rankList"
                border
                style="width: 100%">
            <el-table-column
                    prop="user"
                    label="选手"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="accepted_number"
                    label="解题数"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="total_time"
                    label="总罚时">
            </el-table-column>
            <el-table-column v-for="item in problems" prop="submission_info[item]"
                    :label="item.contestproblem__name">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import contestAPI from '@oj/api/oj.contest'
import moment from 'moment'

export default {
  name: 'ContestRank',
  data () {
    return {
      ruleType: '',
      problems: [],
      rankList: []
    }
  },
  mounted () {
    // this.type = this.$route.params.id
    // console.log(this.type)
    contestAPI.getContestRankList(this.$route.params.contestID).then(res => {
      // console.log(res)
      this.ruleType = res.rule_type
      this.problems = res.problems
      this.rankList = res.rank_list
    })
    console.log(this.ruleType)
  }
}

</script>

<style scoped>
    .container {
        margin: 0 auto;
        max-width: 720px;
    }
</style>
