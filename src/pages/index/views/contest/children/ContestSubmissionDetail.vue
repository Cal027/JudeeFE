<template>
    <el-card class="card-module">
        <div id="status">
            <el-alert show-icon :closable="false" :type="type">
                <span class="title">{{msg}}</span>
                <div class="content">
                    <template v-if="isCE">
                        <div>{{detail.compile_error_info}}</div>
                    </template>
                    <template v-else>
                        <span>时间：{{resolveRunTime(detail.time_cost)}}</span>
                        <span>内存：{{resolveMemory(detail.memory_cost)}}</span>
                        <span>语言：{{detail.language}}</span>
                        <span v-if="notACM">得分：{{detail.score}}</span>
                        <span>作者：{{detail.username}}</span>
                    </template>
                </div>
            </el-alert>
            <el-card v-if="notACM && detail.info &&!isCE" style="margin-top: 20px">
                <el-table :data="detail.info">
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
        </div>
        <div class="float-button">
            <el-tooltip content="刷新">
                <el-button @click="getSubmissionDetail" type="primary" circle icon="el-icon-refresh" size="medium"/>
            </el-tooltip>
        </div>
    </el-card>
</template>

<script>
import submissionAPI from '@oj/api/oj.submission'
import util from '@/utils/util'
import { reviewResults } from '@/utils/util.const'
import * as clipboard from 'clipboard-polyfill'
import Highlight from '@/components/Highlight/index'
import { mapState } from 'vuex'

export default {
  name: 'ContestSubmissionDetail',
  components: { Highlight },
  data () {
    return {
      ID: '',
      detail: '',
      reviewResults,
      isCE: null,
      type: '',
      shared: false,
      msg: 'PENDING'
    }
  },
  // 计算属性获取vuex存储的竞赛状态
  computed: {
    ...mapState('oj/contest', ['contestDetail']),

    notACM () {
      return this.contestDetail.rule_type !== 'ACM'
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
        this.shared = res.shared
        this.isCE = this.detail.compile_error_info !== null
        this.type = this.reviewResults[this.detail.result + 2].tag
        this.msg = this.reviewResults[this.detail.result + 2].msg
        load.close()
      }).catch(err => {
        load.close()
        if (err.response.status === 403) {
          this.$router.back()
        }
      })
    }
  },
  mounted () {
    this.ID = this.$route.params.id
    this.getSubmissionDetail()
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
