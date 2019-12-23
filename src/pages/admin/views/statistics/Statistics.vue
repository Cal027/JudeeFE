<template>
    <d2-container>
        <el-row type="flex" justify="space-between" v-if="isSuperAdmin" style="margin-bottom: 20px">
            <el-col>
                <info-card color="#909399" icon="users" message="用户数" iconSize="35px"
                           class="info-item" :value="overallData.user_number"/>
            </el-col>
            <el-col>
                <info-card color="#909399" icon="list-ul" message="题目数" iconSize="35px"
                           class="info-item" :value="overallData.problem_number"/>
            </el-col>
            <el-col v-if="overallData.contest_number">
                <info-card color="#909399" icon="trophy" message="竞赛数" iconSize="35px"
                           class="info-item" :value="overallContest" v-popover:popover/>
                <el-popover trigger="hover" ref="popover">
                    <info-card color="#909399" icon="trophy" message="筹备中" iconSize="35px"
                               class="info-item" :value="overallData.contest_number.not_start"/>
                    <info-card color="#909399" icon="trophy" message="进行中" iconSize="35px"
                               class="info-item" :value="overallData.contest_number.underway"/>
                    <info-card color="#909399" icon="trophy" message="已结束" iconSize="35px"
                               class="info-item" :value="overallData.contest_number.ended"/>
                </el-popover>
            </el-col>
            <el-col>
                <info-card color="#909399" icon="codepen" message="提交数" iconSize="35px"
                           class="info-item" :value="overallData.submission_number"/>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="16">
                <el-card style="width: 100%;height: 600px">
                    <!--提交线图-->
                    <ve-line :data="submissionData" :settings="                {
                axisSite: { right: ['rate'] },
                yAxisType: ['normal', 'percent'],
                yAxisName: ['次数', '比率']
                }"/>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-row>
                    <el-card style="width: 100%;height: 295px">
                        <!--统计数据扇形图-->
                        <ve-ring v-if="recentSubmission.rows.length>0" :data="recentSubmission" :settings="{roseType: 'radius'}"/>
                        <h4 v-else style="text-align: center">暂无数据</h4>
                    </el-card>
                </el-row>
                <el-row style="margin-top: 10px">
                    <el-card style="width: 100%;height: 295px">
                        <!--柱状图-->
                    </el-card>
                </el-row>
            </el-col>
        </el-row>
    </d2-container>
</template>

<script>
import statisticAPI from '@admin/api/sys.statistics'
import VeRing from 'v-charts/lib/ring.common'
import { mapState } from 'vuex'
import InfoCard from '@admin/components/infoCard'
import VeLine from 'v-charts/lib/line.common'

const results = {
  '-1': 'Compile Error',
  '0': 'Wrong Answer',
  '1': 'Accepted',
  '2': 'CPU Time Limit Exceeded',
  '3': 'Real Time Limit Exceeded',
  '4': 'Memory Limit Exceeded',
  '5': 'Runtime Error',
  '6': 'System Error',
  '7': 'Pending',
  '8': 'Judging',
  '9': 'Partially Accepted'
}
export default {
  name: 'Statistics',
  components: { InfoCard, VeRing, VeLine },
  data () {
    return {
      overallData: {},
      submissionData: { columns: ['date', 'submit', 'ac', 'rate'], rows: [] },
      recentSubmission: {
        columns: ['status', 'number'],
        rows: []
      }
    }
  },
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ]),
    isSuperAdmin: function () {
      return this.info.type === 3
    },
    overallContest: function () {
      try {
        let total = 0
        for (let key in this.overallData.contest_number) {
          total += this.overallData.contest_number[key]
        }
        return total
      } catch (_) {
        return 'N/A'
      }
    }
  },
  created () {
    this.getOverall()
    this.getSubmissionStatistics()
    this.getSubmissionResults()
    console.log(this.recentSubmission)
  },
  methods: {
    getOverall () {
      statisticAPI.getOverall().then(res => {
        this.overallData = res
      })
    },
    getSubmissionStatistics (offset) {
      statisticAPI.getSubmissionStatistics(offset).then(res => {
        this.submissionData.rows = res
      })
    },
    getSubmissionResults (offset) {
      statisticAPI.getSubmissionResults(offset).then(res => {
        Object.keys(res).forEach(key => {
          this.recentSubmission.rows.push({ 'status': results[key], 'number': res[key].count })
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
    .info-container {
        .info-item {
            min-width: 200px;
            margin-bottom: 10px;
        }
    }

</style>
