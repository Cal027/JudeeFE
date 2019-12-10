<template>
    <d2-container>
        <d2-module-index-banner v-bind="banner"/>
        <el-card>
            <div slot="header" style="margin: -5px">
                <el-row :gutter="20">
                    <el-col :span="19">
                        <span style="font-size: 22px">题目列表</span>
                    </el-col>
                    <el-col :span="5">
                        <el-input size="small" v-model="searchText" @change="getProblemList"
                                  prefix-icon="el-icon-search" placeholder="题目关键词"/>
                    </el-col>
                </el-row>
            </div>
            <el-table
                    v-loading="loading"
                    element-loading-text="正在加载"
                    ref="table"
                    :data="tableData"
                    style="width: 100%">
                <el-table-column prop="ID" label="ID" sortable :width="70"/>
                <el-table-column prop="title" label="标题" :width="300">
                </el-table-column>
                <el-table-column prop="difficulty" sortable label="难度" :width="100">
                    <template slot-scope="scope1">
                        <el-tag
                                id="difficulty-tag"
                                size="medium"
                                :type="diffType[scope1.row.difficulty-1]"
                                disable-transitions
                                hit
                        >{{diffOptions[scope1.row.difficulty-1] }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="created_by" label="作者"/>
                <el-table-column prop="rate" label="正确率" :width="80" align="center"/>
                <el-table-column prop="submission_number" label="提交数" :width="100" align="center"/>
                <el-table-column prop="total_score" label="分数" :width="80" align="center"/>
                <el-table-column fixed="right" label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button round size="mini" icon="el-icon-edit"
                                   @click="editProblem(scope.row.ID,scope.row.created_by)"/>
                        <el-button round size="mini" icon="el-icon-download"
                                   @click="downloadTestCase(scope.row.ID)"/>
                        <el-button round type="danger" size="mini" icon="el-icon-delete"
                                   @click="deleteProblem(scope.row.ID)"/>
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
                        :total="problemNum"/>
            </div>
        </el-card>
    </d2-container>
</template>

<script>
import problemAPI from '@admin/api/sys.problem'
import util from '@/utils/util'
import { mapState } from 'vuex'

export default {
  name: 'ProblemList',
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  },
  data () {
    return {
      banner: {
        title: '题目管理',
        subTitle: '在这里可以管理题目'
      },
      diffOptions: ['简单', '普通', '中等', '困难', '非常困难'],
      diffType: ['success', 'info', 'info', 'warning', 'danger'],
      loading: false,
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      problemNum: 0,
      searchText: '',
      // 比赛相关
      contestID: ''
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.getProblemList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getProblemList()
    },
    getProblemList () {
      this.loading = true
      problemAPI.getProblemList(this.pageSize, (this.currentPage - 1) * this.pageSize,
        this.searchText).then(res => {
        for (let i = 0; i < res.results.length; i++) {
          let ac = res.results[i]['accepted_number']
          let sub = res.results[i]['submission_number']
          res.results[i]['rate'] = (sub === 0 ? '0.00' : Math.round(ac / sub * 10000) / 100.00) + '%'
        }
        this.tableData = res.results
        this.problemNum = res.count
        this.loading = false
      })
    },
    editProblem (id, author) {
      if (this.info.name !== author && this.info.type !== 3) {
        this.$message.error('没有权限编辑该题目')
        return
      }
      if (this.$route.name === 'problem-list') {
        this.$router.push({ name: 'edit-problem', params: { problemID: id } })
      } else if (this.$route.name === 'contest-problem-list') {
        this.$router.push({ name: 'edit-contest-problem', params: { problemID: id } })
      }
    },
    downloadTestCase (id) {
      problemAPI.getTestCase(id).then(res => {
        this.$message({
          type: 'success',
          message: '下载成功'
        })
      })
    },
    deleteProblem (id) {
      this.$confirm('确认删除题目？相关数据将被清除', '删除问题', {
        type: 'warning'
      }).then(() => {
        problemAPI.deleteProblem(id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },
  mounted () {
    this.contestID = this.$route.params.contestID
    this.getProblemList()
  }
}
</script>

<style scoped>

</style>
