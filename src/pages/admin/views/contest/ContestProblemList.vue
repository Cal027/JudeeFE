<template>
    <d2-container>
        <d2-module-index-banner v-bind="banner"/>
        <el-card class="panel">
            <template #header>
                <el-row :gutter="20">
                    <el-col :span="22">
                        <span style="font-size: 22px">竞赛题目列表</span>
                    </el-col>
                    <el-col v-if="contestID" :span="2">
                        <el-button icon="el-icon-plus" round type="success"
                                   @click="contestDialog = true" size="mini">添加
                        </el-button>
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
                <el-table-column label="#" sortable width="80">
                    <template v-slot="scope">
                        {{toLetter(scope.$index+1)}}
                    </template>
                </el-table-column>
                <el-table-column label="标题" width="250">
                    <template v-slot="scope">
                        {{scope.row.title}}
                        <d2-icon :name="scope.row.is_public? 'unlock' : 'lock' "/>
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
                                       @click="removeProblem(scope.row.ID)"/>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog title="添加竞赛题目"
                   :before-close="handleClose"
                   @close="getContestProblems"
                   width="65%"
                   :visible.sync="contestDialog">
            <AddProblemContest :contestID="contestID" :contestNum="contestNum"/>
        </el-dialog>
    </d2-container>
</template>

<script>
import problemAPI from '@admin/api/sys.problem'
import { mapState } from 'vuex'
import AddProblemContest from '@admin/views/contest/AddProblemContest'
import util from '@/utils/util'

export default {
  name: 'ContestProblemList',
  components: { AddProblemContest },
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  },
  data () {
    return {
      banner: {
        title: '竞赛题目管理',
        subTitle: '在这里可以管理竞赛题目'
      },
      loading: false,
      tableData: [],
      contestID: '',
      contestDialog: false,
      contestNum: 0
    }
  },
  methods: {
    toLetter (index) {
      return util.formatter.toLetter(index)
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
    getContestProblems () {
      this.loading = true
      problemAPI.getContestProblems(this.contestID).then(res => {
        for (let i = 0; i < res.length; i++) {
          const ac = res[i].accepted_number
          const sub = res[i].submission_number
          res[i].rate = (sub === 0 ? '0.00' : Math.round(ac / sub * 10000) / 100.00) + '%'
        }
        this.contestNum = res.length
        this.tableData = res
        this.loading = false
      })
    },
    handleClose (done) {
      this.$confirm('确认关闭？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          done()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消关闭'
          })
        })
    },
    editProblem (id, author) {
      if (this.info.name !== author && this.info.type !== 3) {
        this.$message.error('没有权限编辑该题目')
        return
      }
      this.$router.push({ name: 'edit-contest-problem', params: { problemID: id } })
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
    removeProblem (id) {
      this.$confirm('确认删除竞赛题目？相关数据将被清除', '删除问题', {
        type: 'warning'
      }).then(() => {
        const data = { problems: [id] }
        problemAPI.deleteContestProblem(this.contestID, data).then(() => {
          this.$message({
            type: 'success',
            message: '已删除题目'
          })
          this.getContestProblems()
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
    this.contestID = this.$route.params.contestID
    this.getContestProblems()
  }
}
</script>

<style scoped>

</style>
