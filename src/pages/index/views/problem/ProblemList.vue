<template>
    <div class="p-list">
        <el-card class="controlPanel-sl">
            <MountainFooter :height="90" :ratio="0.9"/>
            <el-button icon="el-icon-close" type="text" @click="clearFilter" class="clear">清空筛选条件</el-button>
            <el-row>
                <el-col :span="2">搜索:</el-col>
                <el-col :span="8">
                    <el-input size="small"
                              @change="filterProblems"
                              placeholder="搜索题目编号、标题、来源..."
                              v-model="searchText">
                        <el-button slot="append" @click="filterProblems" size="mini">
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
                                 :props="{multiple:true}" @change="filterProblems" :options="tagNames"/>
                </el-col>
            </el-row>
        </el-card>
        <el-card>
            <el-table :data="tableData"
                      :row-class-name="tableRowClassName"
                      v-loading="loadingTable"
                      :header-cell-style="{background: '#E5E9F0'}"
                      element-loading-text="正在加载"
                      @cell-mouse-enter="changeStatistics"
                      @cell-click="problemClick"
                      size="medium">
                <el-table-column prop="ID" label="#" sortable width="70">
                    <template v-slot="scope">
                        <span style="color: #81A1C1;font-weight: 500">{{scope.row.ID}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="标题" width="200"/>
                <el-table-column prop="difficulty" sortable label="难度" width="85">
                    <template v-slot="scope1">
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
                    <template v-slot="scope">
                        <el-tag
                                class="tags"
                                v-for="(name,index) in scope.row.tags"
                                :key="index"
                                type="warning"
                                size="medium"
                                disable-transitions
                                hit
                        >{{ name.name }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="source" label="来源" width="250" align="center"/>
                <el-table-column prop="rate" label="通过率" width="80"/>
                <el-table-column prop="submission_number" label="提交人数" width="90" align="center"/>
                <el-table-column prop="total_score" label="分数" width="80" align="center"/>
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
    </div>
</template>

<script>
import problemAPI from '@oj/api/oj.problem'
import { mapState } from 'vuex'
import MountainFooter from '@oj/components/MountainFooter'

const diffOptions = [{ value: 1, label: '简单' }, { value: 2, label: '普通' }, { value: 3, label: '中等' },
  { value: 4, label: '困难' }, { value: 5, label: '非常困难' }]

export default {
  name: 'ProblemList',
  components: { MountainFooter },
  computed: {
    ...mapState('oj/user', [
      'info'
    ])
  },
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
      pageSize: 20,
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
      this.filterProblems()
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
      this.filterProblems()
    },
    // 处理难度变化
    handleDiff () {
      this.selectAll = this.difficulty.length === 0
      this.filterProblems()
    },
    // ac 的题目就变颜色
    tableRowClassName ({ row, rowIndex }) {
      return (this.info.ac_prob && (this.info.ac_prob.indexOf('|' + row.ID + '|') !== -1 || this.info.ac_prob.indexOf(row.ID + '|') === 0)) ? 'success-row' : ''
    },
    changeStatistics (row, column, cell, event) {
    },
    problemClick (row) {
      this.$router.push({
        name: 'ProblemDetail',
        params: { id: row.ID }
      })
    },
    filterProblems () {
      this.currentPage = 1
      this.getProblems()
    },
    getProblems () {
      this.loadingTable = true
      problemAPI.getProblemWithLimit(this.pageSize, (this.currentPage - 1) * this.pageSize,
        this.tags, this.searchText, this.difficulty).then(response => {
        for (let i = 0; i < response.results.length; i++) {
          const ac = response.results[i].accepted_number
          const sub = response.results[i].submission_number
          response.results[i].rate = (sub === 0 ? '0.00' : Math.round(ac / sub * 10000) / 100.00) + '%'
        }
        this.tableData = response.results
        this.problemNum = response.count
        this.loadingTable = false
      })
    }
  },
  mounted () {
    this.getProblems()
    problemAPI.getTags().then(response => {
      for (let i = 0; i < response.count; i++) {
        const tmp = {}
        tmp.value = response.results[i].id
        tmp.label = response.results[i].name
        this.tagNames.push(tmp)
      }
    })
  }
}
</script>

<style lang="less">
    .p-list{
        .el-table {
            .success-row {
                background: #f0f9eb;
            }
        }
    }
</style>

<style lang="less" scoped>
    .p-list {
        width: 90%;
        margin: 0 auto;

        .controlPanel-sl {
            position: relative;
            margin-bottom: 20px;

            .el-row {
                margin-bottom: 20px;
            }

            .clear {
                margin-bottom: 5px;
                margin-right: 20px;
                position: absolute;
                bottom: 0;
                right: 0;
            }
        }

        #difficulty-tag {
            text-align: center;
            font-weight: bold;
        }

        .tags {
            margin-left: 6px;
            margin-bottom: 3px;
        }
    }
</style>
