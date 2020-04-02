<template>
    <div>
        <el-row style="margin-bottom: 15px" v-show="data.problems.length>0">
            <el-col :span="2" v-show="data.problems.length>0">
                已添加：
            </el-col>
            <el-tooltip v-for="(id,index) in data.problems" :key="index" :content="titles[index]">
                <el-tag size="small" disable-transitions style="margin-left: 10px"
                        closable
                        @close="handleDel(index)">
                    {{toLetter(index+contestNum+1)}}:{{id}}
                </el-tag>
            </el-tooltip>
        </el-row>
        <el-row :gutter="10">
            <el-col :span="18">
                <el-popconfirm title="确定提交题目？" @onConfirm="submit">
                    <template #reference>
                        <el-button round size="small" type="success">提交题目</el-button>
                    </template>
                </el-popconfirm>
            </el-col>
            <el-col :span="6">
                <el-input size="small" v-model="searchText" @change="getProblemList"
                          prefix-icon="el-icon-search" placeholder="题目关键词"/>
            </el-col>
        </el-row>
        <el-table
                v-loading="loading"
                element-loading-text="正在加载"
                ref="table"
                max-height="500"
                :data="tableData">
            <el-table-column prop="ID" label="ID" sortable width="70px"/>
            <el-table-column label="标题" width="300px">
                <template v-slot="scope">
                    {{scope.row.title}}
                    <d2-icon :name="scope.row.is_public? 'unlock-alt' : 'lock' "/>
                </template>
            </el-table-column>
            <el-table-column prop="difficulty" sortable label="难度" width="100px">
                <template v-slot="scope1">
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
            <el-table-column fixed="right" label="操作" align="center">
                <template v-slot="scope">
                    <el-button circle size="mini" icon="el-icon-plus"
                               @click="addProblem(scope.row.ID,scope.row.title)"/>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="pageSize"
                    layout="total, prev, pager, next"
                    :total="problemNum"/>
        </div>
    </div>
</template>

<script>
import problemAPI from '@admin/api/sys.problem'
import contestAPI from '@admin/api/sys.contest'
import util from '@/utils/util'

export default {
  name: 'AddProblemContest',
  props: ['contestID', 'contestNum'],
  data () {
    return {
      currentPage: 1,
      problemNum: 0,
      diffOptions: ['简单', '普通', '中等', '困难', '非常困难'],
      diffType: ['success', 'info', 'info', 'warning', 'danger'],
      loading: false,
      tableData: [],
      titles: [],
      data: { problems: [] },
      pageSize: 15,
      searchText: ''
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.currentPage = val
      this.getProblemList()
    },
    handleDel (index) {
      this.$message({
        message: `删除题目：(ID: ${this.data.problems[index]}) ${this.titles[index]}`,
        type: 'warning'
      })
      this.data.problems.splice(index, 1)
      this.titles.splice(index, 1)
    },
    addProblem (id, title) {
      if (this.data.problems.includes(id)) {
        this.$message.error(`已存在问题: (${id}) ${title}`)
      } else {
        const name = this.toLetter(this.contestNum + this.data.problems.length + 1)
        this.$message({
          message: `添加题目${name}：(${id}) ${title}`,
          type: 'success'
        })
        this.data.problems.push(id)
        this.titles.push(title)
      }
    },
    submit () {
      if (this.data.problems.length === 0) {
        this.$message.error('提交不能为空！')
        return
      }
      contestAPI.addContestProblem(this.contestID, this.data).then(() => {
        this.$message({
          message: `添加${this.data.problems.length}个题目到竞赛成功！`,
          type: 'success'
        })
        this.data.problems = []
        this.titles = []
      })
    },
    getProblemList () {
      this.loading = true
      problemAPI.getProblemList(this.pageSize, (this.currentPage - 1) * this.pageSize,
        this.searchText).then(res => {
        this.tableData = res.results
        this.problemNum = res.count
        this.loading = false
      })
    },
    toLetter (index) {
      return util.formatter.toLetter(index)
    }
  },
  mounted () {
    this.getProblemList()
  }
}
</script>

<style scoped>

</style>
