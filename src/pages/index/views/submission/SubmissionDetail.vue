<template>
    <div>
        <el-row type="flex" justify="space-around">
            <el-col :span="20" id="status">
                <el-alert show-icon
                          :closable="false"
                          :type="type">
                    <span class="title">{{msg}}</span>
                    <div class="content">
                        <template v-if="isCE">
                            <pre>{{detail.compile_error_info}}</pre>
                        </template>
                        <template v-else>
                            <span>时间：{{resolveRunTime(detail.time_cost)}}</span>
                            <span>内存：{{resolveMemory(detail.memory_cost)}}</span>
                            <span>语言：{{detail.language}}</span>
                            <span>得分：{{detail.score}}</span>
                            <span>作者：{{detail.username}}</span>
                        </template>
                    </div>
                </el-alert>
                <br/>
                <el-card v-if="!isCE&&info.length>0">
                    <el-table :data="detail.info">
                        <el-table-column label="测试样例ID">
                            <template slot-scope="scope">
                                {{scope.$index+1}}
                            </template>
                        </el-table-column>
                        <el-table-column label="状态" align="center">
                            <template slot-scope="scope">
                                <el-tag size="small" effect="light"
                                        :type="results[scope.row.result+2].type">
                                    {{results[scope.row.result+2].msg}}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="时间" align="center">
                            <template slot-scope="scope">
                                {{resolveRunTime(scope.row.cpu_time)}}
                            </template>
                        </el-table-column>
                        <el-table-column label="内存" align="center">
                            <template slot-scope="scope">
                                {{resolveMemory(scope.row.memory)}}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
                <div style="margin-top: 30px">
                    <Highlight :code="code"
                               :border-color="getColor(type)"
                               :language="getLanguage(detail.language)"/>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import submissionAPI from '@oj/api/oj.submission'
import util from '@/utils/util'
import Highlight from '@oj/components/Highlight'

const results = [
  { msg: 'COMPILE_ERROR', type: 'warning' },
  { msg: 'WRONG_ANSWER', type: 'error' },
  { msg: 'ACCEPTED', type: 'success' },
  { msg: 'CPU_TIME_LIMIT_EXCEEDED', type: 'warning' },
  { msg: 'REAL_TIME_LIMIT_EXCEEDED', type: 'warning' },
  { msg: 'MEMORY_LIMIT_EXCEEDED', type: 'warning' },
  { msg: 'RUNTIME_ERROR', type: 'error' },
  { msg: 'SYSTEM_ERROR', type: 'error' },
  { msg: 'PENDING', type: 'primary' },
  { msg: 'JUDGING', type: 'primary' },
  { msg: 'PARTIALLY_ACCEPTED', type: 'warning' }
]
export default {
  name: 'SubmissionDetail',
  components: { Highlight },
  data () {
    return {
      ID: '',
      detail: '',
      info: [],
      code: '',
      results,
      isCE: null,
      type: '',
      msg: 'PENDING'
    }
  },
  methods: {
    resolveMemory (memory) {
      return util.formatter.resolveMemory(memory)
    },
    resolveRunTime (time) {
      return util.formatter.resolveRunTime(time)
    },
    getLanguage (lang) {
      if (lang === 'C++') {
        return 'cpp'
      } else if (lang === 'Python3') {
        return 'python'
      } else {
        return 'java'
      }
    },
    getColor (type) {
      console.log(type)
      if (type === 'primary') {
        return 'gray'
      } else if (type === 'success') {
        return 'green'
      } else if (type === 'warning') {
        return 'orange'
      } else {
        return 'red'
      }
    }
  },
  mounted () {
    let load = this.$loading()
    this.ID = this.$route.params.id
    submissionAPI.getSubmission(this.ID).then(res => {
      this.detail = res
      this.code = res.code
      this.info = res.info
      this.isCE = this.detail.compile_error_info !== null
      this.type = this.results[this.detail.result + 2].type
      this.msg = this.results[this.detail.result + 2].msg
      load.close()
    }).catch(err => {
      if (err.response.status === 403) {
        load.close()
        this.$router.back()
      }
    })
  }
}
</script>

<style scoped lang="less">
    #status {
        .title {
            font-size: 20px;
            padding-left: 10px
        }

        .content {
            margin-top: 10px;
            padding-left: 10px;
            font-size: 14px;
            font-weight: 400;
            color: #1b153b;
            line-height: 28px;

            span {
                margin-right: 15px;
            }
        }
    }
</style>
