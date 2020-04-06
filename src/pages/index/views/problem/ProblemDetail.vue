<template>
    <div>
        <div v-if="notContest"
             :class="isSticky? 'float': 'nav'"
             :style="{'margin-top':top+'px','border-bottom': themeColor +' solid','border-width':'2px'}"
             :sticky-z-index="999"
             v-sticky="notContest"
             on-stick="handleSticky"
             sticky-offset="{top:-44}">
            <template>
                <router-link class="header" to="/problem" :style="{color:themeColor}">题目列表</router-link>
                >
                <span class="header" style="font-size: 24px">{{problemDetail.title}}</span>
                <div class="per" v-show="!isSticky">
                    <el-progress :width=66 type="circle"
                                 :percentage="percent"/>
                </div>
                <div class="data" v-show="!isSticky">
                    <p>提交人数：{{problemDetail.submission_number}}</p>
                    <p>通过人数：{{problemDetail.accepted_number}}</p>
                </div>
            </template>
            <el-menu
                    :default-active="$route.name"
                    mode="horizontal"
                    text-color="#1b153b"
                    router
                    class="menu"
                    background-color="transparent">
                <el-menu-item index="ProblemDetail" class="menuItem"
                              :route="{name: 'ProblemDetail',id:problemDetail.id}">做题
                </el-menu-item>
                <el-menu-item index="ProblemSubmissionsMine" class="menuItem"
                              :route="{name:'ProblemSubmissionsMine',id:problemDetail.id}">我的提交
                </el-menu-item>
                <el-menu-item index="ProblemSubmissions" class="menuItem"
                              :route="{name:'ProblemSubmissions',id:problemDetail.id}">所有提交
                </el-menu-item>
            </el-menu>
        </div>
        <div v-else class="mo2">
            <span class="header">{{problemDetail.title}}</span>
            <div class="per">
                <el-progress :width=66 type="circle"
                             :percentage="percent"/>
            </div>
            <div class="data">
                <p>提交人数：{{problemDetail.submission_number}}</p>
                <p>通过人数：{{problemDetail.accepted_number}}</p>
            </div>
        </div>
        <template v-if="$route.name === 'ProblemDetail'||$route.name === 'Contest-problem-detail'">
            <el-dialog title="统计数据" :visible.sync="dialogTableVisible" center>
                <ve-ring v-if="chartData.rows.length>0" :data="chartData" :settings="{roseType: 'radius'}"/>
                <h4 v-else style="text-align: center">暂无数据</h4>
            </el-dialog>
            <div class="problem-status">
                <button>{{isPassed}}</button>
                <button>时间限制: {{problemDetail.time_limit}} ms</button>
                <button>内存限制: {{problemDetail.memory_limit}} MB</button>
                <button>难度: {{diffOptions[problemDetail.difficulty-1]}}</button>
                <button class="showData" @click="dialogTableVisible = true">查看统计数据</button>
            </div>
            <el-card class="card-module">
                <span class="title" :style="{color:themeColor}">来源</span>
                <div class="content">{{problemDetail.source}}</div>
            </el-card>
            <el-card class="card-module">
                <span class="title" :style="{color:themeColor}">题目描述</span>
                <div class="content" v-hlql  v-html="problemDetail.description"/>
            </el-card>
            <el-card class="card-module">
                <span class="title" :style="{color:themeColor}">输入描述</span>
                <div class="content" v-hlql v-html="problemDetail.input_description"/>
                <br/>
                <span class="title" :style="{color:themeColor}">输出描述</span>
                <div class="content" v-hlql v-html="problemDetail.output_description"/>
                <br/>
                <el-row v-for="(sample,index) in problemDetail.samples" :key="index" :gutter="60">
                    <el-col :span="10">
                        <span class="title" :style="{color:themeColor}">输入样例 {{index+1}} </span>
                        <el-button icon="iconfont j-icon-clipboard" @click="copyText(sample.input)"
                                   class="icon-btn" type="text"/>
                        <pre class="sample">{{sample.input}}</pre>
                    </el-col>
                    <el-col :span="10">
                        <span class="title" :style="{color:themeColor}">输出样例 {{index+1}} </span>
                        <pre class="sample">{{sample.output}}</pre>
                    </el-col>
                </el-row>
            </el-card>
            <el-card class="card-module">
                <span class="title" :style="{color:themeColor}">提示</span>
                <div class="content" v-hlql v-html="problemDetail.hint"/>
            </el-card>
            <el-card class="card-module">
                <CodeMirror :value.sync="code"
                            :languages="problemDetail.languages"
                            :language="language"
                            @changeLang="onChangeLang"
                            @resetCode="onResetCode"/>
                <el-button type="warning" round icon="el-icon-edit" :loading="submitLoading"
                           @click="submitCode" style="float: right" size="medium">
                    <span v-if="submitLoading">正在提交</span>
                    <span v-else>提交</span>
                </el-button>
                <el-button v-if="statusVisible" type="primary" round @click="goStatus"
                           style="float: right;margin-right: 10px"
                           size="medium">
                    查看提交结果
                </el-button>
            </el-card>
        </template>
        <transition v-else name="el-fade-in-linear" mode="out-in">
            <router-view :key="$route.name"/>
        </transition>
    </div>
</template>

<script>
import * as clipboard from 'clipboard-polyfill'
import CodeMirror from '@oj/components/CodeMirror.vue'
import problemAPI from '@oj/api/oj.problem'
import util from '@/utils/util'
import VeRing from 'v-charts/lib/ring.common'
import { mapState } from 'vuex'

export default {
  name: 'ProblemDetail',
  components: {
    CodeMirror,
    VeRing
  },
  computed: {
    ...mapState('oj/user', [
      'info'
    ]),
    isPassed: function () {
      return (this.info.ac_prob && (this.info.ac_prob.indexOf('|' + this.$route.params.id + '|') !== -1 || this.info.ac_prob.indexOf(this.$route.params.id + '|') === 0)) ? '已通过' : '尚未通过'
    }
  },
  data () {
    return {
      dialogTableVisible: false,
      direction: 'ttb',
      chartData: {
        columns: ['status', 'number'],
        rows: []
      },
      percent: 0,
      themeColor: '',
      problem: '',
      notContest: false,
      diffOptions: ['简单', '普通', '中等', '困难', '非常困难'],
      problemDetail: {},
      code: '',
      top: -10,
      isSticky: false,
      language: '',
      submissionId: '',
      statusVisible: false,
      submitLoading: false
    }
  },
  methods: {
    handleSticky (data) {
      if (data.sticked) {
        this.isSticky = true
        this.top = 44
      } else {
        this.isSticky = false
        this.top = -10
      }
    },
    getPercent () {
      if (this.problemDetail.submission_number === 0) {
        this.percent = 0
      } else {
        this.percent = (this.problemDetail.accepted_number / this.problemDetail.submission_number).toFixed(2)
        this.percent *= 100
      }
    },
    getProblem (id) {
      const load = this.$loading()
      problemAPI.getProblem(id)
        .then(res => {
          load.close()
          this.problemDetail = res
          this.language = this.problemDetail.languages[0]
          this.getPercent()
          this.chartData.rows.length = 0
          Object.keys(res.statistic_info).forEach(key => {
            this.chartData.rows.push({ status: key, number: res.statistic_info[key] })
          })
          util.title(this.problemDetail.title)
        })
    },
    copyText (text) {
      clipboard.writeText(text)
      this.$notify({
        title: '复制成功',
        message: '已复制到剪贴板！',
        type: 'success'
      })
    },
    onResetCode () {
      this.code = ''
    },
    onChangeLang (newLang) {
      this.language = newLang
    },
    goStatus () {
      const name = this.notContest ? 'submission-detail' : 'Contest-submission-status'
      const params = {
        contestID: this.$route.params.contestID,
        id: this.submissionId
      }
      this.$router.push({ name: name, params: params })
    },
    submitCode () {
      if (this.code.trim() === '') {
        this.$message.error('不能提交空代码')
        return
      }
      const submitFunc = (data) => {
        problemAPI.submitCode(data).then(res => {
          this.submissionId = res
          this.statusVisible = true
          this.$message({
            message: '提交代码成功！',
            type: 'success'
          })
        }).catch(err => {
          this.$message({
            message: err.response.data,
            type: 'error'
          })
        })
        this.submitLoading = false
      }
      this.$confirm('是否确认提交代码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.submissionId = ''
        this.submitLoading = true
        const data = {
          problem: this.problemDetail.ID,
          language: this.language,
          code: this.code
        }
        if (this.$route.params.contestID) {
          data.contest = this.$route.params.contestID
        }
        submitFunc(data)
      })
    }
  },
  mounted () {
    this.notContest = this.$route.name !== 'Contest-problem-detail'
    this.getProblem(this.$route.params.id)
  },
  async created () {
    // 异步加载当前主题色
    this.themeColor = await this.$store.dispatch('oj/db/get', {
      dbName: 'oj',
      path: 'color.value',
      defaultValue: process.env.VUE_APP_COLOR,
      user: true
    })
  }

}
</script>

<style lang="less">
    .per {
        .el-progress__text {
            font-size: 16px !important;
        }
    }
</style>

<style lang="less" scoped>
    .online {
        display: block;
        height: 2px;
        width: 100%;
        margin: -1.5px 0 0;
    }

    .nav {
        padding: 10px 50px 0 50px;
        width: 80% !important;
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        margin: 0 auto 20px;
    }

    .float {
        padding: 10px 80px 0;
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
    }

    .el-menu-item {
        height: 55px;
        margin-top: -5px;
    }

    .header {
        font-size: 24px;
        font-weight: 400;
        color: #1b153b;
        line-height: 38px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    a {
        text-decoration: none;
    }

    .router-link-active {
        text-decoration: none;
    }

    .menu {
        border-bottom: none;
    }

    .menuItem:hover {
        background: #fff !important;
    }

    .menuItem {
        font-size: 16px;
    }

    .mo2 {
        width: 80% !important;
        margin: 0 auto 10px;

        span {
            font-weight: 500;
            color: #3e3e3e;
            margin-left: -25px;
        }
    }

    .title {
        font-size: 20px;
        font-weight: 400;
        margin: 25px 0 8px;
        /*color: #3091f2*/
    }

    .per {
        float: right;
        margin-top: 10px;
        margin-right: -20px;
    }

    .data {
        p {
            margin-block-start: 0.5em;
            margin-block-end: 0.5em;
        }

        margin-top: 8px;
        margin-right: 20px;
        float: right;
    }

    .problem-status {
        margin-left: 8%;

        button {
            background: #fff;
            padding: 3px 15px;
            border-radius: 5px;
            border: 0;
            color: #6d6d6d;
            font-size: 16px;
            margin-top: -5px;
            margin-bottom: 15px;
            margin-right: 10px;
            box-shadow: 0 2px 4px 0 rgba(146, 166, 231, .13);
        }

        .showData {
            cursor: pointer;
        }
    }

    .sample {
        border: 1px solid #e9eaec;
        padding: 5px 10px;
    }

    .icon-btn {
        padding: 0 !important;
    }

    .content {
        margin: 10px 20px 10px 0;
        font-size: 16px
    }

    .text {
        font-size: 14px;
    }

    .item {
        margin-bottom: 18px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

</style>
