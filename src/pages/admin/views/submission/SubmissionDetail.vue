<template>
    <d2-container>
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
                            <template v-slot="scope">
                                {{scope.$index+1}}
                            </template>
                        </el-table-column>
                        <el-table-column label="状态" align="center">
                            <template v-slot="scope">
                                <el-tag size="small" effect="light"
                                        :type="results[scope.row.result+2].type">
                                    {{results[scope.row.result+2].msg}}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="时间" align="center">
                            <template v-slot="scope">
                                {{resolveRunTime(scope.row.cpu_time)}}
                            </template>
                        </el-table-column>
                        <el-table-column label="内存" align="center">
                            <template v-slot="scope">
                                {{resolveMemory(scope.row.memory)}}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
                <el-card style="margin-top: 30px">
                    <template #header>
                        提交代码
                    </template>
                    <Highlight :code="code"
                               :border-color="getColor(type)"
                               :language="getLanguage(detail.language)"/>
                </el-card>
            </el-col>
        </el-row>

    </d2-container>
</template>

<script>
import Highlight from '@/components/Highlight/index'
import submissionAPI from '@admin/api/sys.submission'
import util from '@/utils/util'

const results = [
  { msg: 'COMPILE_ERROR', type: 'warning', tag: 'warning' },
  { msg: 'WRONG_ANSWER', type: 'danger', tag: 'error' },
  { msg: 'ACCEPTED', type: 'success', tag: 'success' },
  { msg: 'CPU_TIME_LIMIT_EXCEEDED', type: 'warning', tag: 'warning' },
  { msg: 'REAL_TIME_LIMIT_EXCEEDED', type: 'warning', tag: 'warning' },
  { msg: 'MEMORY_LIMIT_EXCEEDED', type: 'warning', tag: 'warning' },
  { msg: 'RUNTIME_ERROR', type: 'danger', tag: 'error' },
  { msg: 'SYSTEM_ERROR', type: 'danger', tag: 'error' },
  { msg: 'PENDING', type: 'primary', tag: 'primary' },
  { msg: 'JUDGING', type: 'primary', tag: 'primary' },
  { msg: 'PARTIALLY_ACCEPTED', type: 'warning', tag: 'warning' }
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
  mounted () {
    let load = this.$loading()
    this.ID = this.$route.params.id
    submissionAPI.getSubmission(this.ID, this.$route.params.contestID).then(res => {
      this.detail = res
      this.code = res.code
      this.info = res.info
      this.isCE = this.detail.compile_error_info !== null
      this.type = this.results[this.detail.result + 2].tag
      this.msg = this.results[this.detail.result + 2].msg
      load.close()
    }).catch(() => {
      load.close()
      this.$router.back()
    })
  },
  methods: {
    resolveMemory (memory) {
      return util.formatter.resolveMemory(memory)
    },
    resolveRunTime (time) {
      return util.formatter.resolveRunTime(time)
    },
    getLanguage (lang) {
      return util.formatter.getLanguage(lang)
    },
    getColor (type) {
      return util.formatter.getCodeColor(type)
    }
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
