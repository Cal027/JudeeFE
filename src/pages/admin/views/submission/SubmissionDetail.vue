<template>
    <d2-container>
        <el-row type="flex" justify="space-around">
            <el-col :span="22" id="status">
                <el-alert show-icon
                          :closable="false"
                          :type="type">
                    <span class="title">{{msg}}</span>
                    <div class="content">
                        <template v-if="isCE">
                            <div>{{detail.compile_error_info}}</div>
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
                <el-card v-if="detail.info&&detail.info.length>0&&!isCE">
                    <el-table :data="detail.info">
                        <el-table-column type="expand">
                            <template v-slot="props">
                                <el-form label-position="left" inline class="table-expand">
                                    <el-form-item label="错误类别">
                                        <span>{{errorInfo[props.row.error]}}</span>
                                    </el-form-item>
                                    <el-form-item label="退出信号">
                                        <span>{{props.row.signal}}</span>
                                    </el-form-item>
                                    <el-form-item label="真实时间">
                                        <span>{{props.row.real_time}}MS</span>
                                    </el-form-item>
                                    <el-form-item label="错误详情" :class="props.row.error_info? error-info:''">
                                        <pre v-if="props.row.error_info" v-hl="props.row.error_info">
                                            <code class="cpp"/>
                                        </pre>
                                        <span v-else>暂无错误详情</span>
                                    </el-form-item>
                                    <el-form-item label="退出代号">
                                        <span>{{props.row.exit_code}}</span>
                                    </el-form-item>
                                </el-form>
                            </template>
                        </el-table-column>
                        <el-table-column label="测试样例ID">
                            <template v-slot="scope">
                                {{scope.$index+1}}
                            </template>
                        </el-table-column>
                        <el-table-column label="状态" align="center">
                            <template v-slot="scope">
                                <el-tag size="small" effect="light"
                                        :type="reviewResults[scope.row.result+2].type">
                                    {{reviewResults[scope.row.result+2].msg}}
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
                <el-card class="code-card">
                    <template #header>
                        提交代码
                        <el-button icon="iconfont j-icon-clipboard" @click="copyText(detail.code)"
                                   class="icon-btn" type="text"/>
                    </template>
                    <Highlight :code="detail.code? detail.code: ''"
                               :border-color="getColor(type)"
                               :language="getLanguage(detail.language)"/>
                </el-card>
            </el-col>
        </el-row>
        <div class="float-button">
            <el-tooltip content="刷新">
                <el-button @click="getSubmissionDetail" type="primary" circle icon="el-icon-refresh" size="medium"/>
            </el-tooltip>
        </div>
    </d2-container>
</template>

<script>
import Highlight from '@/components/Highlight/index'
import submissionAPI from '@admin/api/sys.submission'
import util from '@/utils/util'
import { reviewResults } from '@/utils/util.const'
import * as clipboard from 'clipboard-polyfill'

const errorInfo = {
  0: 'Error Not Found',
  '-1': 'Error Invalid Config',
  '-2': 'Error Fork Failed',
  '-3': 'Error Pthread Failed',
  '-4': 'Error Wait Failed',
  '-5': 'Error Root Required',
  '-6': 'Error Load Seccomp Failed',
  '-7': 'Error Setrlimit Failed',
  '-8': 'Error Dup2 Failed',
  '-9': 'Error Set Uid Failed',
  '-10': 'Error Execute Failed',
  '-11': 'Error SPJ error'
}

export default {
  name: 'SubmissionDetail',
  components: { Highlight },
  data () {
    return {
      ID: '',
      detail: '',
      info: [],
      code: '',
      errorInfo,
      reviewResults,
      isCE: null,
      type: '',
      msg: 'PENDING'
    }
  },
  mounted () {
    this.ID = this.$route.params.id
    this.getSubmissionDetail()
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
    },
    copyText (text) {
      clipboard.writeText(text)
      this.$notify({
        title: '复制成功',
        message: '已复制代码到剪贴板！',
        type: 'success'
      })
    },
    getSubmissionDetail () {
      const load = this.$loading()
      submissionAPI.getSubmission(this.ID, this.$route.params.contestID).then(res => {
        this.detail = res
        this.code = res.code
        this.info = res.info
        this.isCE = this.detail.compile_error_info !== null
        this.type = this.reviewResults[this.detail.result + 2].tag
        this.msg = this.reviewResults[this.detail.result + 2].msg
        load.close()
      }).catch(() => {
        load.close()
        this.$router.back()
      })
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

    .float-button {
        position: fixed;
        right: 45px;
        bottom: 25px;

        .el-button {
            box-shadow: 0 3px 9px 2px #BFBFBF;
        }

        .el-button:hover {
            box-shadow: 0 6px 9px 2px #BFBFBF;
        }
    }
</style>

<style lang="less">
    .table-expand {
        font-size: 0;

        label {
            width: 80px;
            color: #5E81AC;
        }

        .el-form-item {
            /*margin-right: 0;*/
            margin-bottom: 5px;
            min-width: 50%;
        }

        .error-info {
            .el-form-item__content {
                line-height: 5px;
            }
        }
    }
</style>
