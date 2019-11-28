<template>
    <d2-container style="width: 80%; margin: 0 auto">
        <el-card class="controlPanel">
            <el-button icon="el-icon-close" type="text" @click="clearFilter" class="clear">清空筛选条件</el-button>
            <el-row>
                <el-col :span="1">搜索:</el-col>
                <el-col :span="5">
                    <el-input size="small" placeholder="搜索题目编号、标题、关键字..." v-model="searchText"
                              @keyup.native.enter="getProblems">
                        <el-button slot="append" @click="getProblems" size="mini">
                            <d2-icon name="search"/>
                        </el-button>
                    </el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="1">难度：</el-col>
                <el-col :span="20">
                    <el-checkbox-group v-model="difficulty">
                        <el-checkbox v-for="dif in diffOptions" :label="dif.id" :key="dif.id">{{dif.name}}</el-checkbox>
                    </el-checkbox-group>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="1">标签：</el-col>
                <el-col :span="20">
                    <el-cascader clearable placeholder="请选择算法标签" v-model="tags"
                                 :show-all-levels="false" filterable size="mini"
                                 :props="{multiple:true}" :options="tagsOptions"/>
                </el-col>
            </el-row>
        </el-card>
        <el-row :gutter="15">
            <el-col :span="24">
                <el-card>
                    <el-table :data="tableData"
                              :row-class-name="tableRowClassName"
                              v-loading="loadingTable"
                              element-loading-text="正在加载"
                              @cell-mouse-enter="changeStatistics"
                              @cell-click="problemClick"
                              size="medium">
                        <el-table-column prop="ID" label="ID" :width="70"/>
                        <el-table-column prop="title" label="题目" :width="250"/>
                        <el-table-column prop="difficulty" label="难度" :width="100"/>
                        <el-table-column prop="tags" label="标签">
                            <template slot-scope="scope">
                                <el-tag
                                        id="index"
                                        v-for="(name,index) in scope.row.tags"
                                        :key="index"
                                        size="medium"
                                        disable-transitions
                                        hit
                                >{{ name.name }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="rate" label="正确率" :width="70"/>
                        <el-table-column prop="submission_number" label="提交数" :width="100"/>
                        <el-table-column prop="total_score" label="分数" :width="70"/>
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
            </el-col>
            <el-col :span="6" v-if="false">
                <el-row>
                    <el-card shadow="always">
                        <el-input placeholder="搜索题目..." v-model="searchText" @keyup.native.enter="getProblems">
                            <el-button slot="append" icon="el-icon-search" @click="getProblems"/>
                        </el-input>
                    </el-card>
                </el-row>
                <el-row :gutter="15">
                    <el-col>
                        <el-card>
                            <h4>标签(点击筛选)</h4>
                            <el-checkbox-group v-model="currentTag" @change="getProblems">
                                <el-checkbox-button v-for="tag in tagNames" :label="tag.id" :key="tag.id">{{tag.name}}
                                </el-checkbox-button>
                            </el-checkbox-group>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </d2-container>
</template>

<script>

export default {
  name: 'ProblemList',
  data () {
    return {
      searchText: '',
      // 难度
      difficulty: [],
      // 难度选项
      diffOptions: [{ 'id': 1, 'name': '简单' }, { 'id': 2, 'name': '普通' }, { 'id': 3, 'name': '中等' }],
      // 标签选项
      tagsOptions: [],
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
      title: 'Statistics',
      tagNames: [],
      currentTag: []
    }
  },
  methods: {
    // 清空筛选
    clearFilter () {
      this.difficulty = []
      this.tags = []
      this.searchText = ''
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getProblems()
    },
    handleCurrentChange (val) {
      this.currentPage = val
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
    // problemLevel (type) {
    //   // if (type === 'Easy') return 'info'
    //   // if (type === 'Medium') return 'success'
    //   // if (type === 'Hard') return ''
    //   // if (type === 'VeryHard') return 'warning'
    //   // if (type === 'ExtremelyHard') return 'danger'
    // },
    changeStatistics (row, column, cell, event) {
    },
    problemClick (row, column, cell, event) {
      // this.$router.push({
      //   name: 'problemdetail',
      //   query: { problemID: row.problem }
      // })
    },
    getProblems () {
      this.loadingTable = true
      this.$api.problem.getProblemWithLimit(this.pageSize, (this.currentPage - 1) * this.pageSize, this.currentTag, this.searchText)
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
        this.tagNames.push(response.data.results[i])
      }
    })
    // TODO 获取难度id和Name
    // TODO 获取标签的父子id和Name
  }
}
</script>

<style scoped>
    .controlPanel{
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

    #leveltag {
        text-align: center;
        font-weight: bold;
    }

    #protag {
        text-align: center;
        font-weight: bold;
        margin-right: 7px;
        margin-bottom: 7px;
    }

    #tag {
        text-align: center;
        font-weight: bold;
        margin-left: 2px;
        margin-bottom: 5px;
    }

    .el-row {
        margin-bottom: 20px;
    }

    .el-table .success-row {
        background: #f0f9eb;
    }
</style>
