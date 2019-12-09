<template>
    <d2-container style="width: 75%; margin: 0 auto">
        <el-card class="controlPanel">
            <el-button icon="el-icon-close" type="text" @click="clearFilter" class="clear">清空筛选条件</el-button>
            <el-row>
                <el-col :span="2">搜索:</el-col>
                <el-col :span="6">
                    <el-input size="small" placeholder="搜索竞赛编号、标题、关键字..." v-model="searchText"
                              @keyup.native.enter="getContests">
                        <el-button slot="append" @click="getContests" size="mini">
                            <d2-icon name="search"/>
                        </el-button>
                    </el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="2">赛制：</el-col>
                <el-col :span="1">
                    <el-checkbox v-model="selectAllRules" @change="handleAllRules">全部</el-checkbox>
                </el-col>
                <el-col :span="20">
                    <el-radio-group v-model="rule_type" style="margin-left: 30px" @change="handleRule">
                        <el-radio label="ACM"/>
                        <el-radio label="OI"/>
                    </el-radio-group>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="2">状态：</el-col>
                <el-col :span="1">
                    <el-checkbox v-model="selectAllStatus" @change="handleAllStatus">全部</el-checkbox>
                </el-col>
                <el-col :span="20">
                    <el-checkbox-group v-model="status" @change="handleStatus" class="group">
                        <el-checkbox :label="0">比赛中</el-checkbox>
                        <el-checkbox :label="-1">已结束</el-checkbox>
                        <el-checkbox :label="1">筹备中</el-checkbox>
                    </el-checkbox-group>
                </el-col>
            </el-row>
        </el-card>
        <el-card v-loading="loading" style="min-height: 200px">
            <p id="no-contest" v-if="contests.length===0&&!loading">暂时没有比赛</p>
            <ol id="contest-list">
                <li v-for="contest in contests" :key="contest.title">
                    <el-row>
                        <el-col :span="1">
                            <el-button @click="changeRule(contest.rule_type)" type="text">
                                <el-badge :value="contest.rule_type" class="rule-badge"/>
                            </el-button>
                        </el-col>
                        <el-col :span="18" class="contest-main">
                            <p class="title">
                                <el-link class="entry" @click.stop="goContest(contest)">{{contest.title}}</el-link>
                                <template v-if="contest.password!==''">
                                    <el-icon class="el-icon-lock" style="margin-left: 5px"/>
                                </template>
                            </p>
                            <ul class="detail">
                                <li>
                                    <el-icon class="el-icon-date"/>
                                    {{resolveTime(contest.start_time)}}
                                </li>
                                <li>
                                    <el-icon class="el-icon-alarm-clock"/>
                                    {{getDuration(contest.start_time, contest.end_time)}}
                                </li>
                            </ul>
                        </el-col>
                    </el-row>
                </li>
            </ol>
            <div style="text-align: center; margin-top: 20px">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[15, 20, 30, 50]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="contestNum"/>
            </div>
        </el-card>
    </d2-container>
</template>

<script>
import util from '@/utils/util'
import contestAPI from '@oj/api/oj.contest'

export default {
  name: 'ContestList',
  data () {
    return {
      searchText: '',
      contests: [],
      rule_type: '',
      status: [],
      selectAllRules: true,
      selectAllStatus: true,
      currentPage: 1,
      pageSize: 15,
      contestNum: 0,
      loading: false
    }
  },
  methods: {
    // 清空筛选
    clearFilter () {
      this.status = []
      this.rule_type = ''
      this.searchText = ''
      this.selectAllRules = true
      this.selectAllStatus = true
      this.getContests()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getContests()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getContests()
    },
    handleRule () {
      this.selectAllRules = false
      this.getContests()
    },
    handleStatus () {
      this.selectAllStatus = this.status.length === 0
      this.getContests()
    },
    handleAllStatus () {
      this.status = []
      this.getContests()
    },
    handleAllRules () {
      this.rule_type = ''
      this.getContests()
    },
    changeRule (val) {
      this.selectAllRules = false
      this.rule_type = val
      this.getContests()
    },
    getContests () {
      // TODO 获取比赛列表
      this.loading = true
      contestAPI.getContestWithLimit(this.pageSize, (this.currentPage - 1) * this.pageSize,
        this.searchText, this.rule_type, this.status).then(res => {
        this.contestNum = res.count
        this.contests = res.results
        this.loading = false
      })
    },
    getDuration (startTime, endTime) {
      return util.time.duration(startTime, endTime)
    },
    resolveTime (time) {
      return util.time.resolveTime(time)
    },
    goContest (contest) {
      const token = util.cookies.get('token')
      if (contest.type !== 'public' && token === '') {
        this.$message.error('请先登录')
      } else {
        this.$router.push({ name: 'Contest-detail', params: { contestID: contest.id } })
      }
    }
  },
  mounted () {
    this.getContests()
  }
}
</script>

<style lang="less" scoped>
    .controlPanel {
        position: relative;
        margin-bottom: 20px;

        .el-row {
            margin-bottom: 20px;
        }
    }

    .clear {
        margin-bottom: 10px;
        margin-right: 20px;
        position: absolute;
        bottom: 0;
        right: 0;
    }

    .group {
        margin-top: 2px;
        margin-left: 30px;
    }

    #no-contest {
        text-align: center;
        font-size: 18px;
        padding: 20px;
    }

    #contest-list {
        > li {
            padding-bottom: 18px;
            padding-left: 10px;
            border-bottom: 1px solid rgba(187, 187, 187, 0.5);
            list-style: none;

            .rule-badge {
                margin-top: 14px;
                margin-left: -15px;
                margin-right: 10px;
            }

            .contest-main {
                .title {
                    margin-bottom: 0;
                    font-size: 18px;
                    .entry {
                        margin-left: 5px;
                        font-size: 18px;
                        font-weight: 400;
                    }
                }

                .detail {
                    margin-left: -90px;
                }

                li {
                    display: inline-block;
                    padding: 10px 0 0 10px;

                    &:first-child {
                        padding: 10px 0 0 0;
                    }
                }
            }
        }
    }
</style>

<style lang="less">
    .rule-badge {
        .el-badge__content {
            border-radius: 11px 11px 11px 0;
            font-weight: 800;
            border: none;
            line-height: 14px;
            padding: 3px 8px;
            display: inline;
        }
    }
</style>
