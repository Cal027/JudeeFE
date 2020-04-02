<template>
    <d2-container>
        <el-row v-if="isSuperAdmin" :gutter="10">
            <el-col :span="6">
                <info-card color="#909399" icon="users" message="用户数" iconSize="35px"
                           class="info-item" :value="overallData.user_number"/>
            </el-col>
            <el-col :span="6">
                <info-card color="#909399" icon="list-ul" message="题目数" iconSize="35px"
                           class="info-item" :value="overallData.problem_number"/>
            </el-col>
            <el-col :span="6" v-if="overallData.contest_number">
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
            <el-col :span="6">
                <info-card color="#909399" icon="codepen" message="提交数" iconSize="35px"
                           class="info-item" :value="overallData.submission_number"/>
            </el-col>
        </el-row>
        <el-divider/>
        <div class="board">
            <el-row :gutter="20">
                <el-col :span="13" :offset="1">
                    <el-card class="upper-card" :body-style="{padding: 5}">
                        <template #header>
                            <el-input-number :style="{width:`${inputWidth(resultOffset)}px`}"
                                             @change="getSubmissionResults"
                                             v-model="resultOffset"
                                             :min="1" :controls="false" size="mini"/>
                            小时提交结果统计
                        </template>
                        <!--统计数据扇形图-->
                        <ve-ring v-if="recentSubmission.rows.length>0" :data="recentSubmission"
                                 :settings="{roseType: 'radius',labelLine:{length:15,length2:10}}"/>
                        <h4 v-else style="text-align: center">暂无数据</h4>
                    </el-card>
                </el-col>
                <el-col :span="9">
                    <el-card class="upper-card" :body-style="{padding: 0}">
                        <template #header>
                            <el-input-number :style="{width:`${inputWidth(loginOffset)}px`}"
                                             @change="getLoginData"
                                             v-model="loginOffset"
                                             :min="1" :controls="false" size="mini"/>
                            天活跃用户数: {{totalActive}}
                        </template>
                        <!--词云图-->
                        <ve-word-cloud :data="loginData" :setting="cloudSetting"/>
                    </el-card>
                </el-col>
            </el-row>
            <el-row style="margin-top: 20px">
                <el-col :span="22" :offset="1">
                    <el-card style="width: 100%;">
                        <template #header>
                            <el-input-number :style="{width:`${inputWidth(submitOffset)}px`}"
                                             @change="getSubmissionStatistics"
                                             v-model="submitOffset"
                                             :min="1" :controls="false" size="mini"/>
                            天提交统计
                        </template>
                        <!--提交线图-->
                        <ve-line :data="submissionData" :settings="submissionSetting"/>
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </d2-container>
</template>

<script>
import statisticAPI from '@admin/api/sys.statistics'
import { mapState } from 'vuex'
import InfoCard from '@admin/components/infoCard'
import VeLine from 'v-charts/lib/line.common'
import VeRing from 'v-charts/lib/ring.common'
import VeWordCloud from 'v-charts/lib/wordcloud.common'

const results = {
  '-2': 'Compile Error',
  '-1': 'Wrong Answer',
  0: 'Accepted',
  1: 'CPU Time Limit Exceeded',
  2: 'Real Time Limit Exceeded',
  3: 'Memory Limit Exceeded',
  4: 'Runtime Error',
  5: 'System Error',
  6: 'Pending',
  7: 'Judging',
  8: 'Partially Accepted'
}
export default {
  name: 'Statistics',
  components: { InfoCard, VeRing, VeLine, VeWordCloud },
  data () {
    return {
      // 统计数据
      overallData: {},
      submissionData: {
        columns: ['date', 'submit', 'ac', 'rate'],
        rows: []
      },
      submissionSetting: {
        axisSite: { right: ['rate'] },
        yAxisType: ['normal', 'percent'],
        yAxisName: ['次数', '比率']
      },
      recentSubmission: {
        columns: ['status', 'number'],
        rows: []
      },
      loginData: {
        columns: ['username', 'count'],
        rows: []
      },
      cloudSetting: {
        shape: 'star',
        sizeMin: 10,
        sizeMax: 42
      },
      totalActive: 0,
      // offset
      resultOffset: 24,
      loginOffset: 7,
      submitOffset: 7
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
        for (const key in this.overallData.contest_number) {
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
    this.getLoginData()
  },
  methods: {
    inputWidth (input) {
      return 10 + input.toString().length * 10
    },
    getOverall () {
      statisticAPI.getOverall().then(res => {
        this.overallData = res
      })
    },
    getSubmissionStatistics () {
      statisticAPI.getSubmissionStatistics(this.submitOffset).then(res => {
        this.submissionData.rows = res
      })
    },
    getSubmissionResults () {
      statisticAPI.getSubmissionResults(this.resultOffset).then(res => {
        this.recentSubmission.rows.length = 0
        Object.keys(res).forEach(key => {
          this.recentSubmission.rows.push({ status: results[res[key].result], number: res[key].count })
        })
      })
    },
    getLoginData () {
      statisticAPI.getLoginData(this.loginOffset).then(res => {
        this.totalActive = res.week_activists
        this.loginData.rows = res.most_active
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

    .upper-card {
        width: 100%;
        height: 450px;
    }

</style>

<style lang="less">
    .board {
        .el-input-number.is-without-controls .el-input__inner {
            padding-left: 3px;
            padding-right: 3px;
        }
    }

</style>
