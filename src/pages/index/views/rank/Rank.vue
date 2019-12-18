<template>
    <el-card v-loading="loading">
        <el-row :gutter="15">
            <el-carousel :autoplay="false" arrow="never" trigger="click" type="card">
                <el-carousel-item v-for="(item,index) in carouselData" :key="index">
                    <h2>{{ item.username }}</h2>
                    <h2>得分：{{ item.score }}</h2>
                </el-carousel-item>
            </el-carousel>
        </el-row>
        <el-row>
            <el-table :data="tableData" @cell-click="userClick" size="small">
                <el-table-column prop="ranking" label="排名"/>
                <el-table-column prop="username" label="用户名"/>
                <el-table-column prop="score" label="分数"/>
                <el-table-column prop="ac" label="通过次数"/>
                <el-table-column prop="submit" label="提交次数"/>
                <el-table-column prop="rate" label="通过率"/>
            </el-table>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 30, 50]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalUser"
            />
        </el-row>
    </el-card>
</template>

<script>
import rankAPI from '@oj/api/oj.rank'

export default {
  name: 'Rank',
  data () {
    return {
      currentPage: 1,
      pageSize: 30,
      totalUser: 10,
      tableData: [],
      carouselData: [],
      loading: true
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.getSubmissionList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getSubmissionList()
    },
    userClick (row) {
      this.$router.push({
        name: 'user',
        params: { username: row.username }
      })
    },
    getRank () {
      rankAPI.getRankList(this.pageSize, (this.currentPage - 1) * this.pageSize).then(res => {
        this.totalUser = res.count
        this.tableData = res.results
        for (let i = 0; i < res.results.length; i++) {
          let ac = res.results[i]['ac']
          let sub = res.results[i]['submit']
          this.tableData[i]['rate'] = (sub === 0 ? '0.00' : Math.round(ac / sub * 10000) / 100.00) + '%'
          this.tableData[i]['ranking'] = (this.currentPage - 1) * this.pageSize + i + 1
        }
        if (this.currentPage === 1) {
          for (let i = 0; i < Math.min(3, this.tableData.length); i++) {
            this.carouselData.push(this.tableData[i])
          }
        }
        this.loading = false
      }
      )
    }
  },
  mounted () {
    this.getRank()
  }
}

</script>

<style scoped>

</style>
