<template>
    <div>
        <el-row style="margin-bottom: 15px" v-show="data.problems.length>0">
            <el-col :span="2" v-show="data.problems.length>0">
                已添加：
            </el-col>
            <el-tooltip v-for="id in data.problems" :key="id" :content="titles[data.problems.indexOf(id)]">
                <el-tag size="small" disable-transitions style="margin-left: 10px"
                        closable @close="handleDel(id)">
                    {{id}}
                </el-tag>
            </el-tooltip>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="19">
                <el-popconfirm title="确定提交题目？" @onConfirm="submit">
                    <el-button slot="reference" round size="small" type="success">提交题目</el-button>
                </el-popconfirm>
            </el-col>
            <el-col :span="5">
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
            <el-table-column fixed="right" label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <el-button circle size="mini" icon="el-icon-plus"
                               @click="addProblem(scope.row.ID,scope.row.title)"/>
                </template>
            </el-table-column>
        </el-table>
        <div style="text-align: center; margin-top: 20px">
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

export default {
  name: 'AddProblemContest',
  props: ['contestID'],
  data () {
    return {
      currentPage: 1,
      problemNum: 0,
      diffOptions: ['简单', '普通', '中等', '困难', '非常困难'],
      diffType: ['success', 'info', 'info', 'warning', 'danger'],
      loading: false,
      tableData: [],
      data: { 'problems': [] },
      titles: [],
      pageSize: 15,
      searchText: ''
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.currentPage = val
      this.getProblemList()
    },
    handleDel (id) {
      let i = this.data.problems.indexOf(id)
      let title = this.titles[i]
      this.data.problems.splice(i, 1)
      this.titles.splice(i, 1)
      this.$message({
        message: `删除题目：(${id}) ${title}`,
        type: 'warning'
      })
    },
    addProblem (id, title) {
      if (this.data.problems.includes(id)) {
        this.$message.error(`已存在问题: (${id}) ${title}`)
      } else {
        this.$message({
          message: `添加题目：(${id}) ${title}`,
          type: 'success'
        })
        this.titles.push(title)
        this.data.problems.push(id)
      }
    },
    submit () {
      if (this.data.problems.length === 0) {
        this.$message.error('提交不能为空！')
        return
      }
      console.log(this.data)
      contestAPI.addContestProblem(this.contestID, this.data).then(res => {
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
    }
  },
  mounted () {
    this.getProblemList()
  }
}
</script>

<style scoped>

</style>
