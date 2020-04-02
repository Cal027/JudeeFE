<template>
    <div class="contest-rank">
        <el-card class="card-module">
            <template #header>
                <el-row>
                    <el-col :span="1">
                        <span style="font-size: 18px">排名</span>
                    </el-col>
                    <el-col :span="5">
                        <el-tag v-if="ruleType==='ACM'&&isCloseEnd" type="info" size="medium">比赛结束前一小时封榜</el-tag>
                    </el-col>
                    <el-col :span="1" :offset="ruleType==='ACM'&&isCloseEnd? 12:17">
                        <el-button icon="el-icon-refresh" style="margin-top: -5px" @click="getContestRank" type="text">
                            刷新
                        </el-button>
                    </el-col>
                    <el-col :span="2">
                        <el-button icon="el-icon-close" type="text" style="margin-top: -5px" @click="clearFilter">
                            清空筛选
                        </el-button>
                    </el-col>
                    <el-col :span="3">
                        <el-input v-model="filterUser" @change="searchUser"
                                  prefix-icon="el-icon-search"
                                  placeholder="筛选用户" size="small"/>
                    </el-col>

                </el-row>
            </template>
            <el-table :data="rankList"
                      :cell-style="getColor"
                      :header-cell-style="{background: '#E5E9F0'}"
                      style="width: 100%">
                <el-table-column prop="rank" label="排位" width="80" align="center" sortable>
                    <template v-slot="scope">
                        <span :style="getRankColor(scope.row.rank)">{{scope.row.rank}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="user" label="选手" width="180"/>
                <el-table-column v-if="ruleType==='ACM'" prop="accepted_number" label="解题数" width="80" align="center"/>
                <el-table-column v-else prop="total_score" label="总分数" width="80" align="center"/>
                <el-table-column prop="submission_number" label="提交次数" width="80" align="center"/>
                <el-table-column v-if="ruleType==='ACM'" prop="total_time" label="总罚时">
                    <template v-slot="scope">
                        {{resolveSecond(scope.row.total_time)}}
                    </template>
                </el-table-column>
                <!--题目数据-->
                <el-table-column v-for="(item,index) in problems" prop="submission_info[item]"
                                 :key="index" align="center" :sortable="ruleType!=='ACM'">
                    <template #header>
                        <router-link :to="
                        {name: 'Contest-problem-detail',
                        params:{contestID: $route.params.contestID, id:item.ID}}">
                            {{toLetter(index+1)}}
                        </router-link>
                    </template>
                    <!--ACM-->
                    <template v-slot="scope" v-if="ruleType==='ACM'">
                        <span v-if="scope.row.submission_info[item.ID] && scope.row.submission_info[item.ID].is_ac">
                            {{resolveSecond(scope.row.submission_info[item.ID].ac_time)}}
                        </span>
                        <span v-if="scope.row.submission_info[item.ID] && scope.row.submission_info[item.ID].error_number">
                            (-{{scope.row.submission_info[item.ID].error_number}})
                        </span>
                    </template>
                    <!--OI-->
                    <template v-slot="scope" v-else>
                        <span v-if="scope.row.submission_info[item.ID]">
                            {{scope.row.submission_info[item.ID]}}
                        </span>
                        <span v-else>0</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

    </div>
</template>

<script>
import contestAPI from '@oj/api/oj.contest'
import util from '@/utils/util'
import { mapState } from 'vuex'
import dayjs from 'dayjs'

export default {
  name: 'ContestRank',
  // 计算属性获取vuex存储的竞赛状态
  computed: {
    ...mapState('oj/contest', ['contestDetail']),

    isCloseEnd () {
      return util.time.isCloseEnd(this.now, this.contestDetail.end_time)
    }
  },
  data () {
    return {
      ruleType: '',
      problems: [],
      rankList: [],
      tableData: [],
      problemToLetter: {},
      filterUser: '',
      contestID: '',
      now: null
    }
  },
  mounted () {
    this.contestID = this.$route.params.contestID
    this.getContestRank()
  },
  methods: {
    toLetter (index) {
      return util.formatter.toLetter(index)
    },
    resolveSecond (second) {
      return util.time.resolveSecond(second)
    },
    clearFilter () {
      this.filterUser = ''
      this.rankList = this.tableData
    },
    getContestRank () {
      this.now = dayjs()
      contestAPI.getContestRankList(this.contestID).then(res => {
        this.ruleType = res.rule_type
        this.problems = res.problems
        this.tableData = res.rank_list
        res.rank_list.forEach((item, index) => {
          this.tableData[index].rank = index + 1
        })
        this.rankList = this.tableData.slice()
      })
    },
    searchUser () {
      // 忽略大小写模糊搜索
      this.rankList = this.tableData.filter(item => {
        return item.user.toLowerCase().indexOf(this.filterUser.toLowerCase()) > -1
      })
    },
    getRankColor (rank) {
      return util.formatter.getRankColor(rank)
    },
    getColor ({ row, column, rowIndex, columnIndex }) {
      let color = ''
      if (columnIndex > 4) {
        const id = this.problems[columnIndex - 5].ID
        if (row.submission_info[id]) {
          if (row.submission_info[id].is_first_ac) {
            color = '#aaaaff'
          } else if (row.submission_info[id].is_ac && !row.submission_info[id].error_number) {
            color = '#a0eac5'
          } else if (row.submission_info[id].is_ac) {
            color = '#aef9d3'
          } else if (row.submission_info[id].error_number < 5) {
            color = '#ffe4e1'
          } else if (row.submission_info[id].error_number >= 5) {
            color = '#ec9097'
          }
        }
      }
      return { background: color }
    }
  }
}

</script>

<style lang="less">
    .contest-rank {
        .el-card__header {
            padding: 5px 10px !important;
        }

        .el-table__body tr,
        .el-table__body td {
            padding: 0;
            height: 40px;
        }
    }
</style>

<style scoped>
    a {
        color: #76a3cd;
        text-decoration: none;
    }

    .router-link-active {
        color: #76a3cd;
        text-decoration: none;
    }
</style>
