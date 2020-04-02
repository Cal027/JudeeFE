<template>
    <d2-container>
        <d2-module-index-banner v-bind="banner"/>
        <el-card class="panel">
            <template #header>
                <el-row :gutter="20">
                    <el-col :span="19">
                        <span style="font-size: 22px">题目列表</span>
                    </el-col>
                    <el-col :span="5">
                        <el-input size="small" v-model="searchText" @change="getProblemList"
                                  prefix-icon="el-icon-search" placeholder="题目关键词"/>
                    </el-col>
                </el-row>
            </template>
            <el-table
                    v-loading="loading"
                    element-loading-text="正在加载"
                    ref="table"
                    :data="tableData"
                    style="width: 100%">
                <el-table-column prop="ID" label="ID" sortable width="70"/>
                <el-table-column label="标题" width="250">
                    <template v-slot="scope">
                        {{scope.row.title}}
                        <d2-icon :name="scope.row.is_public? 'unlock' : 'lock' "/>
                    </template>
                </el-table-column>
                <el-table-column prop="difficulty" sortable label="难度" width="100">
                    <template v-slot="scope1">
                        <el-tag
                                id="difficulty-tag"
                                size="medium"
                                :type="diffType[scope1.row.difficulty-1]"
                                disable-transitions
                                hit>{{diffOptions[scope1.row.difficulty-1] }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="created_by" label="作者"/>
                <el-table-column prop="rate" label="通过率" width="80" align="center"/>
                <el-table-column prop="submission_number" label="提交人数" width="100" align="center"/>
                <el-table-column prop="total_score" label="分数" width="80" align="center"/>
                <el-table-column fixed="right" label="操作" width="180" align="center">
                    <template v-slot="scope">
                        <el-tooltip :content="scope.row.is_public? '私密':'公开'">
                            <el-button circle size="mini"
                                       @click="makePublicORNot(scope.$index,scope.row.ID,scope.row.is_public)">
                                <d2-icon :name="scope.row.is_public?'eye-slash':'eye'"/>
                            </el-button>
                        </el-tooltip>
                        <el-tooltip content="编辑">
                            <el-button circle size="mini" icon="el-icon-edit"
                                       @click="editProblem(scope.row.ID,scope.row.created_by)"/>
                        </el-tooltip>
                        <el-tooltip content="下载测试用例">
                            <el-button circle size="mini" icon="el-icon-download"
                                       @click="downloadTestCase(scope.row.ID)"/>
                        </el-tooltip>
                        <el-tooltip content="删除题目">
                            <el-button circle type="danger" size="mini" icon="el-icon-delete"
                                       @click="deleteProblem(scope.row.ID)"/>
                        </el-tooltip>
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
                        :total="problemNum"/>
            </div>
        </el-card>
    </d2-container>
</template>

<script>
import problemAPI from '@admin/api/sys.problem'
import { mapState } from 'vuex'

export default {
  name: 'ProblemList',
  computed: {
    ...mapState('d2admin/user', ['info'])
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
      searchText: ''
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
    makePublicORNot (index, id, now) {
      const data = {
        is_public: !now
      }
      problemAPI.updateProblem(id, data).then(() => {
        this.$message({
          type: 'success',
          message: '成功'
        })
      })
      this.tableData[index].is_public = !now
    },
    getProblemList () {
      this.loading = true
      problemAPI.getProblemList(this.pageSize, (this.currentPage - 1) * this.pageSize,
        this.searchText).then(res => {
        for (let i = 0; i < res.results.length; i++) {
          const ac = res.results[i].accepted_number
          const sub = res.results[i].submission_number
          res.results[i].rate = (sub === 0 ? '0.00' : Math.round(ac / sub * 10000) / 100.00) + '%'
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
      this.$router.push({ name: 'edit-problem', params: { problemID: id } })
    },
    downloadTestCase (id) {
      problemAPI.getTestCase(id).then(resp => {
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(resp)
        link.download = `problem_${id}_test_cases.zip`
        document.body.appendChild(link)
        link.click()
        link.remove()
      })
    },
    deleteProblem (id) {
      this.$confirm('确认删除题目？相关数据将被清除', '删除问题', {
        type: 'warning'
      }).then(() => {
        problemAPI.deleteProblem(id).then(() => {
          this.$message({
            type: 'success',
            message: '已删除题目'
          })
          this.getProblemList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },
  mounted () {
    this.getProblemList()
  }
}
</script>

<style scoped>

</style>
