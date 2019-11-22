<template>
    <el-row :gutter="15">
        <el-col :span="18">
            <el-card shadow="always">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[15, 20, 30, 50]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="problemNum"
                ></el-pagination>

                <el-table
                        :data="tableData"
                        :row-class-name="tableRowClassName"
                        @cell-mouse-enter="changeStatistics"
                        @cell-click="problemClick"
                        size="small"
                >
                    <el-table-column prop="ID" label="ID" :width="70"></el-table-column>
                    <el-table-column prop="title" label="Title" :width="250"></el-table-column>
                    <el-table-column prop="difficulty" label="Difficulty" :width="100"></el-table-column>
                    <!--                    <el-table-column prop="level" label="Level" :width="170">-->
                    <!--                        <template slot-scope="scope1">-->
                    <!--                            <el-tag-->
                    <!--                                    id="leveltag"-->
                    <!--                                    size="medium"-->
                    <!--                                    :type="problemLevel(scope1.row.level)"-->
                    <!--                                    disable-transitions-->
                    <!--                                    hit-->
                    <!--                            >{{ scope1.row.level }}</el-tag>-->
                    <!--                        </template>-->
                    <!--                    </el-table-column>-->
                    <el-table-column prop="tags" label="Tag">
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
                    <el-table-column prop="rate" label="AC rate" :width="70"></el-table-column>
                    <el-table-column prop="submission_number" label="Submissions" :width="100"></el-table-column>
                    <el-table-column prop="total_score" label="Score" :width="70"></el-table-column>
                </el-table>
                <div style="text-align: center;">
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="[15, 20, 30, 50]"
                            :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="problemNum"
                    ></el-pagination>
                </div>
            </el-card>
        </el-col>
        <el-col :span="6">
            <!--            统计信息相关-->
            <!--            <el-row :gutter="15">-->
            <!--                <el-col>-->
            <!--                    <prostatistice ref="prosta"></prostatistice>-->
            <!--                </el-col>-->
            <!--            </el-row>-->
            <el-row>
                <el-card shadow="always">
                    <h4>Search the problem ID or title</h4>
                    <el-input placeholder="Search..." v-model="searchText" @keyup.native.enter="getProblems">
                        <el-button slot="append" icon="el-icon-search" @click="getProblems"></el-button>
                    </el-input>
                </el-card>
            </el-row>
            <el-row :gutter="15">
                <el-col>
                    <el-card shadow="always">
                        <h4>Filter the tags</h4>
                        <el-checkbox-group v-model="currentTag" @change="getProblems">
                            <el-checkbox-button v-for="tag in tagNames" :label="tag.id" :key="tag.id">{{tag.name}}
                            </el-checkbox-button>
                        </el-checkbox-group>
                    </el-card>
                </el-col>
            </el-row>
        </el-col>
    </el-row>
</template>

<script>

export default {
  name: 'ProblemList',
  data () {
    return {
      currentPage: 1,
      pageSize: 15,
      problemNum: 10,
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
      // tagNames: [{ 'id': 1, 'name': 'test1' }, { 'id': 2, 'name': 'test2' }],
      tagNames: [],
      currentTag: [],
      searchText: ''
    }
  },
  methods: {
    // statusChange (val) {
    //   // if (val === true) {
    //   //   this.searchoj = 'LPOJ'
    //   // } else {
    //   //   this.searchoj = ''
    //   // }
    //   this.searchTitle()
    // },
    searchTitle () {
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
    // problemLevel: function (type) {
    //   // if (type === 'Easy') return 'info'
    //   // if (type === 'Medium') return 'success'
    //   // if (type === 'Hard') return ''
    //   // if (type === 'VeryHard') return 'warning'
    //   // if (type === 'ExtremelyHard') return 'danger'
    // },
    changeStatistics: function (row, column, cell, event) {
    },
    problemClick: function (row, column, cell, event) {
      // this.$router.push({
      //   name: 'problemdetail',
      //   query: { problemID: row.problem }
      // })
    },
    getProblems: function () {
      this.$api.problem.getProblemWithLimit(this.pageSize, (this.currentPage - 1) * this.pageSize, this.currentTag, this.searchText)
        .then(response => {
          for (let i = 0; i < response.data.results.length; i++) {
            let ac = response.data.results[i]['accepted_number']
            let sub = response.data.results[i]['submission_number']
            response.data.results[i]['rate'] = (sub === 0 ? '0.00' : Math.round(ac / sub * 10000) / 100.00) + '%'
          }
          this.tableData = response.data.results
          this.problemNum = response.data.count
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
  }
}
</script>

<style scope>
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
