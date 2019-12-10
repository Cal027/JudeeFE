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
                        <el-input size="small" v-model="searchText"
                                  prefix-icon="el-icon-search" placeholder="题目关键词"/>
                    </el-col>
                </el-row>
            </div>
            <el-table
                    v-loading="loading"
                    element-loading-text="正在加载"
                    ref="table"
                    max-height="700"
                    @row-dblclick="handleDblclick"
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
                <el-table-column prop="rate" label="正确率" :width="80"/>
                <el-table-column prop="submission_number" label="提交数" :width="100"/>
                <el-table-column prop="total_score" label="分数" :width="80"/>
                <el-table-column fixed="right" label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button round size="mini" icon="el-icon-edit"
                                   />
                        <el-button round type="danger" size="mini" icon="el-icon-delete"
                                   @click.native="deleteProblem(scope.row.ID)"/>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </d2-container>
</template>

<script>
import problemAPI from '@admin/api/sys.problem'

export default {
  name: 'ProblemList',
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
    handleDblclick (row) {
      row.isEditing = true
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
    deleteProblem (id) {
      console.log(id)
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
    this.getProblemList()
  }
}
</script>

<style scoped>

</style>
