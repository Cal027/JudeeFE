<template>
    <div class="container">
        <el-carousel autoplay arrow="hover" type="card" height="200px" :interval="5000">
            <el-carousel-item v-for="(item,index) in carouselData" :key="index">
                <div  class="content">
                    <h2>{{ item.username }}</h2>
                    <h2>得分：{{ item.score }}</h2>
                    <h3>通过题数：{{ item.ac_prob_num }}</h3>
                </div>
            </el-carousel-item>
        </el-carousel>
        <el-card class="rank-table">
            <el-table :data="tableData"
                      :header-cell-style="{background: '#E5E9F0'}"
                      @cell-click="userClick" size="medium" >
                <el-table-column prop="ranking" label="排名" align="center" sortable>
                    <template v-slot="scope">
                        <span :style="getRankColor(scope.row.ranking)">{{scope.row.ranking}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="username" label="用户名" align="center"/>
                <el-table-column prop="score" label="分数" align="center"/>
                <el-table-column prop="ac_prob_num" label="通过题数" align="center" sortable/>
                <el-table-column prop="ac" label="通过次数" align="center" sortable/>
                <el-table-column prop="submit" label="提交次数" align="center" sortable/>
                <el-table-column prop="rate" label="通过率" align="center"/>
            </el-table>
            <div class="pagination">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[10, 20, 30, 50]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalUser"/>
            </div>
        </el-card>
    </div>
</template>

<script>
import rankAPI from '@oj/api/oj.rank'
import util from '@/utils/util'

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
      this.getRank()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getRank()
    },
    userClick (row) {
      this.$router.push({
        name: 'user',
        params: { username: row.username }
      })
    },
    getRankColor (rank) {
      return util.formatter.getRankColor(rank)
    },
    getRank () {
      rankAPI.getRankList(this.pageSize, (this.currentPage - 1) * this.pageSize).then(res => {
        this.totalUser = res.count
        this.tableData = res.results
        for (let i = 0; i < res.results.length; i++) {
          const ac = res.results[i].ac
          const sub = res.results[i].submit
          this.tableData[i].rate = (sub === 0 ? '0' : Math.round(ac / sub * 10000) / 100.00) + '%'
          this.tableData[i].ranking = (this.currentPage - 1) * this.pageSize + i + 1
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
    .container {
        margin: 0 auto;
        width: 80%;
    }

    .content{
        margin-top: 50px;
        text-align: center;
    }

    .el-carousel {
        margin: 0 auto;
        width: 80%;
    }

    .el-carousel__item {
        opacity: 0.8;
    }

    .el-carousel__item:nth-child(2n) {
        background-color: #EFEFEF ;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    }

    .el-carousel__item:nth-child(2n+1) {
        background-color: #F0F2F5;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)

    }
</style>
