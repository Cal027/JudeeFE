<template>
    <div :class="contestID? 'submission-card':'sl'">
        <el-card class="controlPanel-sl" v-if="showPanel">
            <template #header>
                <span>筛选记录</span>
                <el-button icon="el-icon-refresh" class="header-button" @click="filterSubmissionList" type="text">
                    刷新
                </el-button>
                <el-button icon="el-icon-close" type="text" @click="clearFilter" class="header-button">
                    清空筛选
                </el-button>
            </template>
            <MountainFooter :height="45" :ratio="0.85"/>
            <el-row :gutter="20">
                <el-col :span="5" v-show="!isProblem">
                    <el-input v-model="problemID" @change="filterSubmissionList" size="medium"
                              prefix-icon="el-icon-search" placeholder="搜索题目编号"/>
                </el-col>
                <el-col :span="3">
                    <el-input v-model="username" @change="filterSubmissionList" size="medium"
                              prefix-icon="el-icon-search" placeholder="搜索用户"/>
                </el-col>
                <el-col :span="3">
                    <el-select size="medium" clearable placeholder="语言" v-model="language"
                               @change="filterSubmissionList">
                        <el-option
                                v-for="lag in languageOptions"
                                :key="lag" :label="lag" :value="lag"/>
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-select size="medium" clearable placeholder="评测状态" v-model="result"
                               @change="filterSubmissionList">
                        <el-option
                                v-for="(r,index) in reviewResults"
                                :key="index" :label="r.msg" :value="index-2"/>
                    </el-select>
                </el-col>
                <el-col :span="9" v-show="!isProblem">
                    <el-switch style="float: right;margin-top: 15px" v-model="myself" active-text="我的"
                               inactive-text="全部" @change="filterSubmissionList"/>
                </el-col>
            </el-row>
        </el-card>
        <el-card :class="contestID? 'card-module':''">
            <template #header v-if="!showPanel">
                <el-select v-model="problemID"
                           @change="filterSubmissionList"
                           placeholder="全部"
                           style="width: 73px;margin-right: 10px"
                           clearable size="small">
                    <el-option v-for="(val, key, index) in Letter" :key="index" :label="val" :value="key"/>
                </el-select>
                <el-button icon="el-icon-refresh" class="header-button" @click="filterSubmissionList" type="text">
                    刷新
                </el-button>
            </template>
            <el-table
                    class="submission-table"
                    :data="tableData"
                    v-loading="loadingTable"
                    :header-cell-style="{background: '#E5E9F0'}"
                    :default-sort="{prop: 'create_time', order: 'descending'}"
                    element-loading-text="正在加载">
                <el-table-column prop="ID" label="递交ID" width="90px" align="center">
                    <template v-slot="scope">
                        <router-link v-if="contestID" :to="'/contest/'+contestID+'/status/'+scope.row.ID">
                            {{scope.row.ID}}
                        </router-link>
                        <span class="router-span" v-else @click="pushDetailRouter(scope.row.ID,scope.row.username,scope.row.shared)">
                            {{scope.row.ID}}
                            <d2-icon v-if="scope.row.shared" name="unlock" style="margin-left: 1px"/>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column v-if="contestID" prop="problem" label="题目编号" width="80" align="center">
                    <template v-slot="scope">
                        <router-link :to="
                        {name: 'Contest-problem-detail',
                        params:{contestID: $route.params.contestID, id:scope.row.problem}}">
                            {{Letter[scope.row.problem]}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column v-else prop="problem" label="题目编号" width="80" align="center">
                    <template v-slot="scope">
                        <router-link :to="'/problem/'+scope.row.problem">
                            {{scope.row.problem}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="username" label="用户" align="center">
                    <template v-slot="scope">
                        <div :class="getNameColor(scope.row.username)">
                            <router-link :to="'/user/'+scope.row.username">{{scope.row.username}}</router-link>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="language" label="语言" align="center"/>
                <el-table-column label="状态" align="center">
                    <template v-slot="scope">
                        <el-tag size="small" effect="light"
                                :type="reviewResults[scope.row.result+2].type">
                            {{reviewResults[scope.row.result+2].msg}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="时间" align="center">
                    <template v-slot="scope">
                        {{resolveRunTime(scope.row.time_cost)}}
                    </template>
                </el-table-column>
                <el-table-column label="内存" align="center">
                    <template v-slot="scope">
                        {{resolveMemory(scope.row.memory_cost)}}
                    </template>
                </el-table-column>
                <el-table-column label="递交时间"
                                 sortable
                                 width="200px"
                                 prop="create_time">
                    <template v-slot="scope">
                        {{resolveTime(scope.row.create_time)}}
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[15, 20, 30, 50]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalNum"/>
            </div>
        </el-card>
    </div>
</template>

<script>
import submissionAPI from '@oj/api/oj.submission'
import problemAPI from '@oj/api/oj.problem'
import util from '@/utils/util'
import { reviewResults, languageOptions } from '@/utils/util.const'
import MountainFooter from '@oj/components/MountainFooter'
import { mapState } from 'vuex'

export default {
  name: 'SubmissionList',
  components: { MountainFooter },
  computed: {
    ...mapState('oj/user', [
      'info'
    ])
  },
  data () {
    return {
      languageOptions,
      language: '',
      myself: false,
      problemID: '',
      username: '',
      result: '',
      isProblem: false,
      showPanel: true,
      tableData: [],
      loadingTable: false,
      reviewResults,
      // 分页相关
      currentPage: 1,
      pageSize: 20,
      totalNum: 0,
      Letter: {},
      // 竞赛相关
      contestID: '',
      searchProblem: ''
    }
  },
  methods: {
    clearFilter () {
      this.language = ''
      this.result = ''
      this.username = ''
      this.currentPage = 1
      this.myself = false
      if (!this.isProblem) {
        this.problemID = ''
      }
      this.getSubmissionList()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getSubmissionList()
    },
    getNameColor (username) {
      if (username === this.info.username) {
        return 'own-submission'
      } else {
        return ''
      }
    },
    resolveTime (time) {
      return util.time.resolveTimes(time)
    },
    resolveRunTime (time) {
      return util.formatter.resolveRunTime(time)
    },
    resolveMemory (memory) {
      return util.formatter.resolveMemory(memory)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getSubmissionList()
    },
    filterSubmissionList () {
      this.currentPage = 1
      this.getSubmissionList()
    },
    getSubmissionList () {
      this.loadingTable = true
      submissionAPI.getSubmissionList(this.pageSize, (this.currentPage - 1) * this.pageSize,
        this.username, this.language, this.problemID, this.result, this.myself, this.contestID).then(res => {
        this.loadingTable = false
        this.totalNum = res.count
        this.tableData = res.results
      }).catch(err => {
        if (err.message === '请求错误') {
          this.$message.error('不存在的用户或题目编号')
          this.loadingTable = false
        }
      })
    },
    pushDetailRouter (id, username, isShared) {
      if (username === this.info.username || isShared) {
        this.$router.push({ path: `/status/${id}` })
      } else {
        this.$message.error('无访问权限')
      }
    },
    getProblemList () {
      problemAPI.getContestProblems(this.contestID).then(res => {
        res.forEach((item, index) => {
          this.Letter[item.ID] = util.formatter.toLetter(index + 1)
        })
        this.getSubmissionList()
      })
    }
  },
  mounted () {
    if (this.$route.params.contestID) {
      this.showPanel = false
      this.contestID = this.$route.params.contestID
      this.myself = true
      this.getProblemList()
    } else {
      if (this.$route.params.id) {
        this.problemID = this.$route.params.id
      }
      if (this.$route.name === 'ProblemSubmissionsMine') {
        this.showPanel = false
        this.myself = true
      }
      this.isProblem = this.$route.name === 'ProblemSubmissions'
      this.getSubmissionList()
    }
  }
}
</script>

<style lang="less">
    .sl {
        width: 85%;
        margin: 0 auto;

        .controlPanel-sl {
            .el-card__body {
                padding: 16px;
            }

            .el-card__header {
                padding: 15px 18px;
            }
        }
    }

    .submission-card{
        .el-card__header {
            padding: 0;
            text-align: right;
        }
    }

</style>

<style scoped lang="less">
    .controlPanel-sl {
        position: relative;
        margin-bottom: 20px;

        .header-button {
            float: right;
            padding: 3px 0;
            margin-left: 5px;
        }
    }

    .submission-table {
        a{
            color: #76a3cd;
            text-decoration: none;
        }

        .router-link-active {
            color: #76a3cd;
            text-decoration: none;
        }

        .router-span {
            color: #76a3cd;
            cursor: pointer;
        }
    }

    .own-submission{
        a {
            font-weight: 600;
            color: #BF616A;
        }

        .router-link-active {
            font-weight: 600;
            color: #BF616A;
        }
    }
</style>
