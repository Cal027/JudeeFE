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
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-row>
                    <el-card style="width: 100%;height: 295px">
                        <!--统计数据扇形图-->
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
import { mapState } from 'vuex'
import InfoCard from '@admin/components/infoCard'

export default {
  name: 'Statistics',
  components: { InfoCard },
  data () {
    return {
      overallData: {},
      submissionData: []
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
  },
  methods: {
    getOverall () {
      statisticAPI.getOverall().then(res => {
        this.overallData = res
      })
    },
    getSubmissionStatistics (offset) {
      statisticAPI.getSubmissionStatistics(offset).then(res => {
        this.submissionData = res
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
