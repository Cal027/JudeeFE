<template>
    <d2-container>
        <!--筛选面板-->
        <el-card class="panel">
            <template #header>
                <span>筛选记录</span>
                <el-button icon="el-icon-refresh" class="header-button" @click="filterSubmissionList" type="text">
                    刷新
                </el-button>
                <el-button icon="el-icon-close" class="header-button" type="text" @click="clearFilter">
                    清空筛选
                </el-button>
            </template>
            <el-row :gutter="20">
                <el-col :span="5">
                    <el-input v-model="problemID" @change="filterSubmissionList" size="medium"
                              prefix-icon="el-icon-search" placeholder="搜索题目编号"/>
                </el-col>
                <el-col :span="4">
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
                <el-col :span="2" :offset="6">
                    <el-popconfirm title="确定重新评测选中题目？" @onConfirm="rejudge">
                        <template #reference>
                            <el-button type="primary" round size="small">重新评测</el-button>
                        </template>
                    </el-popconfirm>
                </el-col>
            </el-row>
        </el-card>
        <!--记录表格-->
        <el-card>
            <el-table
                    class="table"
                    :data="tableData"
                    v-loading="loadingTable"
                    :header-cell-style="{background: '#E5E9F0'}"
                    :default-sort="{prop: 'create_time', order: 'descending'}"
                    @selection-change="handleSelectionChange"
                    element-loading-text="正在加载">
                <el-table-column type="selection" width="55"/>
                <el-table-column prop="ID" label="递交ID" width="90px">
                    <template v-slot="scope">
                        <router-link :to="'/status/'+scope.row.ID">{{scope.row.ID}}</router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="problem" label="题目编号" width="80" align="center"/>
                <el-table-column prop="username" label="用户" align="center"/>
                <el-table-column prop="language" label="语言" align="center"/>
                <el-table-column label="状态" align="center">
                    <template v-slot="scope">
                        <el-tag size="small" effect="light"
                                :type="results[scope.row.result+2].type">
                            {{results[scope.row.result+2].msg}}
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
    </d2-container>
</template>

<script>
import util from '@/utils/util'
import submissionAPI from '@admin/api/sys.submission'

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
  name: 'submissionList',
  data () {
    return {
      languageOpt: ['Java', 'C++', 'C', 'Python3'],
      language: '',
      problemID: '',
      contestID: '',
      username: '',
      result: '',
      isProblem: false,
      showPanel: true,
      tableData: [],
      loadingTable: false,
      selection: [],
      results,
      // 分页相关
      currentPage: 1,
      pageSize: 20,
      totalNum: 0,
      Letter: {}
    }
  },
  mounted () {
    this.getSubmissionList()
  },
  methods: {
    clearFilter () {
      this.language = ''
      this.result = ''
      this.username = ''
      this.currentPage = 1
      this.problemID = ''
      this.getSubmissionList()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getSubmissionList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getSubmissionList()
    },
    filterSubmissionList () {
      this.currentPage = 1
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
    getSubmissionList () {
      this.loadingTable = true
      submissionAPI.getSubmissionList(this.pageSize, (this.currentPage - 1) * this.pageSize,
        this.username, this.language, this.problemID, this.result, this.contestID).then(res => {
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
    rejudge () {
      let data = []
      this.selection.forEach((item, index) => {
        data[index] = item.ID
      })
      submissionAPI.rejudgeSubmission(data).then(() => {
        this.$message({
          type: 'success',
          message: '重新评测' + data.length + '项记录'
        })
      })
    },
    handleSelectionChange (val) {
      this.selection = val
    }
  }
}
</script>

<style lang="less">
    .panel {
        .el-card__body {
            padding: 16px;
        }

        .el-card__header {
            padding: 15px 18px;
        }
    }
</style>

<style scoped lang="less">
    .panel {
        position: relative;
        margin-bottom: 20px;

        .header-button {
            float: right;
            padding: 3px 0;
            margin-left: 5px;
        }

    }

    a {
        color: #76a3cd;
        text-decoration: none;
    }

    .router-link-active {
        color: #76a3cd;
        text-decoration: none;
    }
</style>
