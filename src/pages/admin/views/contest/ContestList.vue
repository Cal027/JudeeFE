<template>
    <d2-container>
        <d2-module-index-banner v-bind="banner"/>
        <el-card>
            <template #header>
                <div style="margin: -5px">
                    <el-row :gutter="20">
                        <el-col :span="19">
                            <span style="font-size: 22px">竞赛列表</span>
                        </el-col>
                        <el-col :span="5">
                            <el-input size="small" v-model="searchText" @change="getContests"
                                      prefix-icon="el-icon-search" placeholder="竞赛关键词"/>
                        </el-col>
                    </el-row>
                </div>
            </template>
            <el-table
                    v-loading="loading"
                    element-loading-text="正在加载"
                    ref="table"
                    :data="tableData"
                    style="width: 100%">
                <el-table-column prop="id" label="ID" sortable :width="70"/>
                <el-table-column prop="title" label="标题"/>
                <el-table-column label="开始时间">
                    <template v-slot="scope">
                        {{resolveTime(scope.row.start_time)}}
                    </template>
                </el-table-column>
                <el-table-column label="结束时间">
                    <template v-slot="scope">
                        {{resolveTime(scope.row.end_time)}}
                    </template>
                </el-table-column>
                <el-table-column prop="created_by" label="作者"/>
                <el-table-column fixed="right" label="操作" width="200" align="center">
                    <template v-slot="scope">
                        <el-tooltip content="编辑">
                            <el-button circle size="small" icon="el-icon-edit"
                                       @click="editContest(scope.row.id,scope.row.created_by)"/>
                        </el-tooltip>
                        <el-tooltip content="管理公告">
                            <el-button circle size="small" @click="goAnnouncement(scope.row.id)">
                                <d2-icon name="bullhorn"/>
                            </el-button>
                        </el-tooltip>
                        <el-tooltip content="查看竞赛题目">
                            <el-button circle size="small" icon="el-icon-postcard"
                                       @click="goContestProblems(scope.row.id)"/>
                        </el-tooltip>
                        <el-tooltip content="删除竞赛">
                            <el-button circle type="danger" size="small" icon="el-icon-delete"
                                       @click="deleteContest(scope.row.id)"/>
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
                        :total="contestNum"/>
            </div>
        </el-card>
    </d2-container>
</template>

<script>
import util from '@/utils/util'
import contestAPI from '@admin/api/sys.contest'
import { mapState } from 'vuex'

export default {
  name: 'ContestList',
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  },
  data () {
    return {
      banner: {
        title: '竞赛管理',
        subTitle: '在这里可以管理竞赛'
      },
      searchText: '',
      tableData: [],
      loading: false,
      currentPage: 1,
      pageSize: 15,
      contestNum: 0
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
    resolveTime (time) {
      return util.time.resolveTime(time)
    },
    getContests () {
      this.loading = true
      contestAPI.getContestList(this.pageSize, (this.currentPage - 1) * this.pageSize,
        this.searchText).then(res => {
        this.contestNum = res.count
        this.tableData = res.results
        this.loading = false
      })
    },
    editContest (id, author) {
      if (this.info.name !== author && this.info.type !== 3) {
        this.$message.error('没有权限编辑该竞赛')
        return
      }
      this.$router.push({ name: 'edit-contest', params: { contestID: id } })
    },
    goContestProblems (id) {
      this.$router.push({ name: 'contest-problem-list', params: { contestID: id } })
    },
    goAnnouncement (id) {
      this.$router.push({ name: 'contest-announcement', params: { contestID: id } })
    },
    deleteContest (id) {
      this.$confirm('确认删除竞赛？相关数据将被清除', '删除问题', {
        type: 'warning'
      }).then(() => {
        contestAPI.deleteContest(id).then(() => {
          this.$message({
            type: 'success',
            message: '已删除题目'
          })
          this.getContests()
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
    this.getContests()
  }
}
</script>

<style scoped>

</style>
