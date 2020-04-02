<template>
    <d2-container>
        <d2-module-index-banner v-bind="banner"/>
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
                <el-col :span="4">
                    <el-input v-model="contestID" @change="filterSubmissionList" size="medium"
                              prefix-icon="el-icon-search" placeholder="搜索竞赛编号"/>
                </el-col>
                <el-col :span="4">
                    <el-input v-model="problemID" @change="filterSubmissionList" size="medium"
                              prefix-icon="el-icon-search" placeholder="搜索题目编号"/>
                </el-col>
                <el-col :span="4">
                    <el-input v-model="username" @change="filterSubmissionList" size="medium"
                              prefix-icon="el-icon-search" placeholder="搜索用户名"/>
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
                <el-col :span="3" :offset="2">
                    <el-popconfirm title="确定重新评测选中提交？" @onConfirm="rejudge">
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
                    ref="table"
                    v-loading="loadingTable"
                    :header-cell-style="{background: '#E5E9F0'}"
                    :default-sort="{prop: 'create_time', order: 'descending'}"
                    @selection-change="handleSelectionChange"
                    element-loading-text="正在加载">
                <el-table-column type="selection" width="50" :selectable="checkSelectable"/>
                <el-table-column prop="ID" label="递交ID" width="80" align="center">
                    <template v-slot="scope">
                        <router-link :to="'/status/'+scope.row.ID">{{scope.row.ID}}</router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="problem" label="题目编号" width="80" align="center"/>
                <el-table-column prop="contest" label="竞赛编号" width="80" align="center"/>
                <el-table-column prop="username" label="用户" align="center"/>
                <el-table-column prop="language" label="语言" width="80" align="center"/>
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
    </d2-container>
</template>

<script>
import util from '@/utils/util'
import { reviewResults, languageOptions } from '@/utils/util.const'
import submissionAPI from '@admin/api/sys.submission'

export default {
  name: 'submissionList',
  data () {
    return {
      banner: {
        title: '评测管理',
        subTitle: '在这里可以管理所有评测记录'
      },
      languageOptions,
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
      reviewResults,
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
      this.$refs.table.clearSelection()
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
    checkSelectable (row) {
      return row.result !== 6 && row.result !== 7
    },
    rejudge () {
      if (this.selection.length === 0) {
        this.$message.error('未选中评测记录')
      } else {
        const data = []
        this.selection.forEach((item, index) => {
          data[index] = item.ID
        })
        submissionAPI.rejudgeSubmission(data).then(res => {
          this.$notify({
            title: '重新评测成功',
            type: 'success',
            message: res.length + '项测评记录 ' + res + ' 已重新评测',
            duration: 3000
          })
          this.filterSubmissionList()
        })
      }
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
        margin-bottom: 10px;

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
