<template>
    <d2-container style="width: 90%; margin: 0 auto">
        <el-card class="controlPanel">
            <el-button icon="el-icon-close" type="text" @click="clearFilter" class="clear">清空筛选条件</el-button>
            <el-row>
                <el-col :span="2">搜索:</el-col>
                <el-col :span="8">
                    <el-input size="small" placeholder="搜索题目编号、标题、关键字..." v-model="searchText"
                              @keyup.native.enter="getProblems">
                        <el-button slot="append" @click="getProblems" size="mini">
                            <d2-icon name="search"/>
                        </el-button>
                    </el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="2">难度：</el-col>
                <el-col :span="20">
                    <el-checkbox v-model="selectAll" @change="handleAllDiff">全部
                    </el-checkbox>
                    <el-checkbox-group v-model="difficulty">
                        <el-checkbox v-for="dif in diffOptions" :label="dif.value"
                                     :key="dif.value" @change="handleDiff">{{dif.label}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="2">标签：</el-col>
                <el-col :span="8">
                    <el-cascader clearable placeholder="请选择算法标签" v-model="tags"
                                 :show-all-levels="false" filterable size="mini" style="width: 100%"
                                 :props="{multiple:true}" @change="getProblems" :options="tagNames"/>
                </el-col>
            </el-row>
        </el-card>
        <el-card>
            <el-table :data="tableData"
                      :row-class-name="tableRowClassName"
                      v-loading="loadingTable"
                      max-height="700"
                      element-loading-text="正在加载"
                      @cell-mouse-enter="changeStatistics"
                      @cell-click="problemClick"
                      size="medium">
                <el-table-column prop="ID" label="ID" sortable :width="70"/>
                <el-table-column prop="title" label="题目" :width="250"/>
                <el-table-column prop="difficulty" sortable label="难度" :width="100">
                    <template slot-scope="scope1">
                        <el-tag
                                id="difficulty-tag"
                                size="medium"
                                :type="diffType[scope1.row.difficulty-1]"
                                disable-transitions
                                hit
                        >{{diffOptions[scope1.row.difficulty-1].label }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="tags" label="标签">
                    <template slot-scope="scope">
                        <el-tag
                                class="tags"
                                v-for="(name,index) in scope.row.tags"
                                :key="index"
                                size="medium"
                                disable-transitions
                                hit
                        >{{ name.name }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="rate" label="正确率" :width="80"/>
                <el-table-column prop="submission_number" label="提交数" :width="100"/>
                <el-table-column prop="total_score" label="分数" :width="80"/>
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
const diffOptions = [{ value: 1, label: '简单' }, { value: 2, label: '普通' }, { value: 3, label: '中等' },
  { value: 4, label: '困难' }, { value: 5, label: '非常困难' }]
export default {
  name: 'ProblemList',
  data () {
    return {
      diffType: ['success', 'info', 'info', 'warning', 'danger'],
      searchText: '',
      // 难度
      difficulty: [],
      selectAll: true,
      // 难度选项
      diffOptions,
      // 标签选项
      tagNames: [],
      // 标签
      tags: [],
      loadingTable: false,
      currentPage: 1,
      pageSize: 15,
      problemNum: 0,
      tableData: [],
      ac: 100,
      mle: 100,
      tle: 100,
      rte: 100,
      pe: 100,
      ce: 100,
      wa: 100,
      se: 100,
      title: 'Statistics'
    }
  },
  methods: {
    // 清空筛选
    clearFilter () {
      this.difficulty = []
      this.tags = []
      this.searchText = ''
      this.selectAll = true
      this.getProblems()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getProblems()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getProblems()
    },
    handleAllDiff () {
      this.difficulty = []
      this.getProblems()
    },
    // 处理难度变化
    handleDiff () {
      this.selectAll = this.difficulty.length === 0
      this.getProblems()
    },
    // ac 的题目就变颜色
    tableRowClassName ({ row, rowIndex }) {
      var acProb = localStorage.getItem('ac_prob')
      if (acProb && acProb.indexOf(row.ID + '') !== -1) {
        // console.log(acProb)
        return 'success-row'
      }
      return ''
    },
    changeStatistics (row, column, cell, event) {
    },
    problemClick (row) {
      this.$router.push({
        name: 'ProblemDetail',
        params: { id: row.ID, problemDetail: row }
      })
    },
    getProblems () {
      this.loadingTable = true
      this.$api.problem.getProblemWithLimit(this.pageSize, (this.currentPage - 1) * this.pageSize,
        this.tags, this.searchText, this.difficulty)
        .then(response => {
          for (let i = 0; i < response.data.results.length; i++) {
            let ac = response.data.results[i]['accepted_number']
            let sub = response.data.results[i]['submission_number']
            response.data.results[i]['rate'] = (sub === 0 ? '0.00' : Math.round(ac / sub * 10000) / 100.00) + '%'
          }
          this.tableData = response.data.results
          this.problemNum = response.data.count
          this.loadingTable = false
        })
    }
  },
  mounted () {
    this.getProblems()
    this.$api.problem.getTags().then(response => {
      for (let i = 0; i < response.data.count; i++) {
        let tmp = {}
        tmp.value = response.data.results[i].id
        tmp.label = response.data.results[i].name
        this.tagNames.push(tmp)
      }
    })
  }
}
</script>

<style>
    .controlPanel {
        position: relative;
        margin-bottom: 20px;
    }

    .clear {
        margin-bottom: 10px;
        margin-right: 20px;
        position: absolute;
        bottom: 0;
        right: 0;
    }

    #difficulty-tag {
        text-align: center;
        font-weight: bold;
    }

    .tags {
        margin-left: 6px;
    }

    .el-row {
        margin-bottom: 20px;
    }

    .el-table .success-row {
        background: #f0f9eb;
    }
</style>
