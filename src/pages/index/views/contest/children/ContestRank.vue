<template>
    <div class="contest-rank">
        <el-card class="card-module">
            <template #header>
                <el-row>
                    <el-col :span="1">
                        <span style="font-size: 18px">排名</span>
                    </el-col>
                    <el-col :span="2" :offset="18">
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
            <el-table v-if="ruleType==='ACM'"
                      :data="rankList"
                      border
                      :cell-style="getColor"
                      :header-cell-style="{background: '#E5E9F0'}"
                      style="width: 100%">
                <el-table-column type="index" label="排位" width="60" align="center"/>
                <el-table-column prop="user"
                                 label="选手"
                                 width="180"/>
                <el-table-column prop="accepted_number" label="解题数" width="80" align="center"/>
                <el-table-column prop="total_time" label="总罚时">
                    <template v-slot="scope">
                        {{resolveSecond(scope.row.total_time)}}
                    </template>
                </el-table-column>
                <el-table-column v-for="(item,index) in problems"
                                 prop="submission_info[item]"
                                 :key="index"
                                 align="center">
                    <template #header>
                        <router-link :to="
                        {name: 'Contest-problem-detail',
                        params:{contestID: $route.params.contestID, id:item.ID}}">
                            {{toLetter(index+1)}}
                        </router-link>
                    </template>
                    <template v-slot="scope">
                        <span v-if="scope.row.submission_info[item.ID] && scope.row.submission_info[item.ID].is_ac">
                            {{resolveSecond(scope.row.submission_info[item.ID].ac_time)}}
                        </span>
                        <span v-if="scope.row.submission_info[item.ID] && scope.row.submission_info[item.ID].error_number">
                            (-{{scope.row.submission_info[item.ID].error_number}})
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
      tableData: [],
      problemToLetter: {},
      filterUser: ''
    }
  },
  mounted () {
    // this.type = this.$route.params.id
    // console.log(this.type)
    contestAPI.getContestRankList(this.$route.params.contestID).then(res => {
      this.ruleType = res.rule_type
      this.problems = res.problems
      this.tableData = res.rank_list
      this.rankList = res.rank_list
    })
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
    searchUser () {
      this.rankList = this.tableData.filter(item => {
        return String(item.user).toLowerCase().indexOf(this.filterUser) > -1
      })
    },
    getColor ({ row, column, rowIndex, columnIndex }) {
      let color = ''
      if (columnIndex > 3) {
        const id = this.problems[columnIndex - 4].ID
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
      return { 'background': color }
    }
  }
}

</script>

<style lang="less">
    .contest-rank {
        .el-card__header {
            padding: 5px 10px !important;
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
