<template>
    <d2-container style="width: 90%; margin: 0 auto">
        <el-card class="controlPanel">
            <div slot="header">
                <span>筛选记录</span>
                <el-button icon="el-icon-close" type="text" @click="clearFilter"
                           style="float: right; padding: 3px 0">清空筛选条件
                </el-button>
            </div>
            <el-row :gutter="20">
                <el-col :span="5">
                    <el-input v-model="title" @change="getSubmissionList" size="medium"
                              prefix-icon="el-icon-search" placeholder="搜索题目编号"/>
                </el-col>
                <el-col :span="3">
                    <el-input v-model="username" @change="getSubmissionList" size="medium"
                              prefix-icon="el-icon-search" placeholder="搜索用户"/>
                </el-col>
                <el-col :span="2">
                    <el-select size="medium" clearable placeholder="语言" v-model="language" @change="getSubmissionList">
                        <el-option
                                v-for="lag in languageOpt"
                                :key="lag" :label="lag" :value="lag"/>
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-select size="medium" clearable placeholder="评测状态" v-model="result" @change="getSubmissionList">
                        <el-option
                                v-for="(r,index) in results"
                                :key="index" :label="r.msg" :value="index-2"/>
                    </el-select>
                </el-col>
                <el-col :span="10">
                    <el-switch style="float: right;margin-top: 15px" v-model="myself" active-text="我的"
                               inactive-text="全部" @change="getSubmissionList"/>
                </el-col>
            </el-row>
        </el-card>
        <el-card>
            <el-table
                    class="table"
                    :data="tableData"
                    v-loading="loadingTable"
                    max-height="700"
                    :default-sort="{prop: 'create_time', order: 'descending'}"
                    element-loading-text="正在加载">

                <el-table-column prop="ID" label="递交ID" width="90px"/>
                <el-table-column prop="problem" label="题目编号" width="80px" align="center">
                    <template slot-scope="scope">
                        <router-link :to="'/problem/'+scope.row.problem">{{scope.row.problem}}</router-link>
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
                        <el-tag size="small" effect="dark" :type="results[scope.row.result+2].type">
                            {{results[scope.row.result+2].msg}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="时间" align="center">
                    <template slot-scope="scope">
                        {{resolveRunTime(scope.row.statistic_info.cpu_time)}}
                    </template>
                </el-table-column>
                <el-table-column label="内存" align="center">
                    <template slot-scope="scope">
                        {{resolveMemory(scope.row.statistic_info.memory)}}
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
    </d2-container>
</template>

<script>
import submissionAPI from '@oj/api/oj.submission'
import util from '@/utils/util'

const results = [
  { msg: 'COMPILE_ERROR', type: 'warning' },
  { msg: 'WRONG_ANSWER', type: 'danger' },
  { msg: 'ACCEPTED', type: 'success' },
  { msg: 'CPU_TIME_LIMIT_EXCEEDED', type: 'warning' },
  { msg: 'REAL_TIME_LIMIT_EXCEEDED', type: 'warning' },
  { msg: 'MEMORY_LIMIT_EXCEEDED', type: 'warning' },
  { msg: 'RUNTIME_ERROR', type: 'danger' },
  { msg: 'SYSTEM_ERROR', type: 'danger' },
  { msg: 'PENDING', type: 'info' },
  { msg: 'JUDGING', type: 'info' },
  { msg: 'PARTIALLY_ACCEPTED', type: 'warning' }
]

export default {
  name: 'SubmissionList',
  data () {
    return {
      languageOpt: ['Java', 'C++', 'C', 'Python3'],
      language: '',
      myself: false,
      title: '',
      username: '',
      result: '',
      tableData: [],
      loadingTable: false,
      results,
      // 分页相关
      currentPage: 1,
      pageSize: 20,
      totalNum: 0
    }
  },
  methods: {
    clearFilter () {
      this.language = ''
      this.title = ''
      this.username = ''
      this.myself = false
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
      if (!time) {
        return '-'
      } else {
        return time + 'MS'
      }
    },
    resolveMemory (memory) {
      if (!memory) {
        return '-'
      } else if (memory > 1024 * 1024) {
        return memory / (1024 * 1024) + 'MB'
      } else {
        return memory / 1024 + 'KB'
      }
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getSubmissionList()
    },
    getSubmissionList () {
      this.loadingTable = true
      submissionAPI.getSubmissionList(this.pageSize, (this.currentPage - 1) * this.pageSize,
        this.username, this.language, this.title, this.result, this.myself).then(res => {
        this.loadingTable = false
        this.totalNum = res.count
        this.tableData = res.results
      })
    }
  },
  mounted () {
    this.getSubmissionList()
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
