<template>
    <div style="width: 85%; margin: 0 auto;">
        <el-card class="controlPanel" v-if="showPanel">
            <div slot="header">
                <span>筛选记录</span>
                <el-button icon="el-icon-refresh" class="header-button" @click="filterSubmissionList" type="text">
                    刷新
                </el-button>
                <el-button icon="el-icon-close" type="text" @click="clearFilter" class="header-button">
                    清空筛选
                </el-button>
            </div>
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
                                v-for="lag in languageOpt"
                                :key="lag" :label="lag" :value="lag"/>
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-select size="medium" clearable placeholder="评测状态" v-model="result"
                               @change="filterSubmissionList">
                        <el-option
                                v-for="(r,index) in results"
                                :key="index" :label="r.msg" :value="index-2"/>
                    </el-select>
                </el-col>
                <el-col :span="9" v-show="!isProblem">
                    <el-switch style="float: right;margin-top: 15px" v-model="myself" active-text="我的"
                               inactive-text="全部" @change="filterSubmissionList"/>
                </el-col>
            </el-row>
        </el-card>
        <el-card>
            <el-table
                    class="table"
                    :data="tableData"
                    v-loading="loadingTable"
                    :default-sort="{prop: 'create_time', order: 'descending'}"
                    element-loading-text="正在加载">

                <el-table-column prop="ID" label="递交ID" width="90px">
                    <template slot-scope="scope">
                        <router-link :to="'/status/'+scope.row.ID">{{scope.row.ID}}</router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="problem" label="题目编号" width="80px" align="center">
                    <template slot-scope="scope">
                        <router-link :to="'/problem/'+scope.row.problem">{{scope.row.name?scope.row.name:scope.row.problem}}</router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="username" label="用户" align="center">
                    <template slot-scope="scope">
                        <router-link :to="'/user/'+scope.row.username">{{scope.row.username}}</router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="language" label="语言" align="center"/>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag size="small" effect="light"
                                :type="results[scope.row.result+2].type">
                            {{results[scope.row.result+2].msg}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="时间" align="center">
                    <template slot-scope="scope">
                        {{resolveRunTime(scope.row.time_cost)}}
                    </template>
                </el-table-column>
                <el-table-column label="内存" align="center">
                    <template slot-scope="scope">
                        {{resolveMemory(scope.row.memory_cost)}}
                    </template>
                </el-table-column>
                <el-table-column label="递交时间"
                                 sortable
                                 width="200px"
                                 prop="create_time">
                    <template slot-scope="scope">
                        {{resolveTime(scope.row.create_time)}}
                    </template>
                </el-table-column>
            </el-table>
            <div style="text-align: center; margin-top: 20px">
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
import util from '@/utils/util'

const results = [
  { msg: 'Compile Error', type: 'warning' },
  { msg: 'Wrong Answer', type: 'danger' },
  { msg: 'Accepted', type: 'success' },
  { msg: 'CPU Time Limit Exceeded', type: 'warning' },
  { msg: 'Real Time Limit Exceeded', type: 'warning' },
  { msg: 'Memory Limit Exceeded', type: 'warning' },
  { msg: 'Runtime Error', type: 'danger' },
  { msg: 'System Error', type: 'danger' },
  { msg: 'Pending', type: 'info' },
  { msg: 'Judging', type: 'info' },
  { msg: 'Partially Accepted', type: 'warning' }
]

export default {
  name: 'SubmissionList',
  data () {
    return {
      languageOpt: ['Java', 'C++', 'C', 'Python3'],
      language: '',
      myself: false,
      problemID: '',
      contestID: '',
      username: '',
      result: '',
      isProblem: false,
      showPanel: true,
      tableData: [],
      loadingTable: false,
      results,
      // 分页相关
      currentPage: 1,
      pageSize: 20,
      totalNum: 0,
      primary: {
        'background-color': '#ecf5ff',
        'border-color': '#d9ecff',
        'color': '#409EFF'
      }
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
    }
  },
  mounted () {
    if (this.$route.params.id) {
      this.problemID = this.$route.params.id
    }
    if (this.$route.params.contestID) {
      this.showPanel = false
      this.contestID = this.$route.params.contestID
      this.myself = true
    }
    if (this.$route.name === 'ProblemSubmissionsMine') {
      this.showPanel = false
      this.myself = true
    }
    this.isProblem = this.$route.name === 'ProblemSubmissions'
    this.getSubmissionList()
    console.log(this.tableData)
  }
}
</script>

<style lang="less">
    .controlPanel {
        .el-card__body {
            padding: 16px;
        }

        .el-card__header {
            padding: 15px 18px;
        }
    }
</style>

<style scoped lang="less">
    .controlPanel {
        position: relative;
        margin-bottom: 20px;

        .header-button {
            float: right;
            padding: 3px 0;
            margin-left: 5px;
        }
    }

    .table {
        a {
            color: #2d8cf0;
            text-decoration: none;
        }

        .router-link-active {
            color: #2d8cf0;
            text-decoration: none;
        }
    }
</style>
