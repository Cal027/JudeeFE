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
                    <el-checkbox-group v-model="rules" @change="handleRule" class="group">
                        <el-checkbox label="ACM"/>
                        <el-checkbox label="OI"/>
                    </el-checkbox-group>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="2">比赛状态：</el-col>
                <el-col :span="1">
                    <el-checkbox v-model="selectAllStatus" @change="handleAllStatus">全部</el-checkbox>
                </el-col>
                <el-col :span="20">
                    <el-checkbox-group v-model="status" @change="handleStatus" class="group">
                        <el-checkbox label="比赛中"/>
                        <el-checkbox label="已结束"/>
                        <el-checkbox label="筹备中"/>
                    </el-checkbox-group>
                </el-col>
            </el-row>
        </el-card>
        <el-card>
            <p id="no-contest" v-if="contests.length===0">暂时没有比赛</p>
            <ol id="contest-list">
                <li v-for="contest in contests" :key="contest.title">
                    <el-row>
                        <el-col :span="1">
                            <el-button @click="changeRule(contest.rule)" type="text">
                                <el-badge :value="contest.rule" class="rule-badge"/>
                            </el-button>
                        </el-col>
                        <el-col :span="18" class="contest-main">
                            <p class="title">
                                <a class="entry" @click.stop="goContest(contest)">{{contest.title}}</a>
                                <template v-if="contest.type!=='public'">
                                    <el-icon class="el-icon-lock" style="margin-left: 5px"/>
                                </template>
                            </p>
                            <ul class="detail">
                                <li>
                                    <el-icon class="el-icon-date"/>
                                    {{contest.start_time}}
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

export default {
  name: 'ContestList',
  data () {
    return {
      searchText: '',
      contests: [
        {
          'title': 'Judee OJ 模拟赛1',
          'type': 'public',
          'rule': 'ACM',
          'start_time': '2019-12-18 00:00',
          'end_time': '2019-12-28 00:00'
        },
        {
          'title': 'Judee OJ 模拟赛2',
          'type': 'class',
          'rule': 'OI',
          'start_time': '2019-2-18 00:00',
          'end_time': '2019-12-18 00:00'
        },
        {
          'title': 'Judee OJ 模拟赛3',
          'type': 'class',
          'rule': 'ACM',
          'start_time': '2019-12-18 10:00',
          'end_time': '2019-12-18 12:30'
        }
      ],
      rules: [],
      status: [],
      selectAllRules: true,
      selectAllStatus: true,
      currentPage: 1,
      pageSize: 15,
      contestNum: 0
    }
  },
  methods: {
    // 清空筛选
    clearFilter () {
      this.difficulty = []
      this.types = []
      this.status = []
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
      this.selectAllRules = this.rules.length === 0
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
      this.rules = []
      this.getContests()
    },
    changeRule (val) {
      this.selectAllRules = false
      this.rules = [val]
      this.getContests()
    },
    getContests () {
      // TODO 获取比赛列表
    },
    getDuration (startTime, endTime) {
      return util.time.duration(startTime, endTime)
    },
    goContest (contest) {
      this.cur_contest_id = contest.id
      if (contest.type !== 'public') {
        this.$message.error('请先登录')
      } else {
        // this.$router.push({ name: 'Contest-detail', params: { contestID: contest.id } })
        this.$router.push({ name: 'Contest-detail', params: { contestID: 1 } })
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
                margin-left: -5px;
            }

            .contest-main {
                .title {
                    font-size: 18px;

                    a.entry {
                        color: #495060;

                        &:hover {
                            color: #2d8cf0;
                            border-bottom: 1px solid #2d8cf0;
                        }
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
            line-height: 14px;
            padding: 3px 8px;
            display: inline;
        }
    }
</style>
