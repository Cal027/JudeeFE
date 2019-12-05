<template>
    <d2-container type="ghost" style="margin: 0 auto;width: 80%">
        <div class="float-nav" slot="header">
            <div class="header">
                <router-link to="/problem" :style="myStyle">题目列表</router-link>
                >
                <span style="font-size: 24px">{{problemDetail.title}}</span>
            </div>
            <el-menu
                    :default-active="activeIndex"
                    mode="horizontal"
                    text-color="#1b153b"
                    class="menu"
                    background-color="transparent">
                <el-menu-item index="1" class="menuItem">做题</el-menu-item>
                <el-menu-item index="2" class="menuItem">我的提交</el-menu-item>
                <el-menu-item index="3" class="menuItem">所有提交</el-menu-item>
            </el-menu>
        </div>
        <el-card class="module" shadow="hover">
            <span class="title" :style="myStyle">题目描述</span>
            <div class="content" v-highlight v-html="problemDetail.description"/>
            <div v-if="problemDetail.source">
                <span class="title" :style="myStyle">来源</span>
                <div class="content">{{problemDetail.source}}</div>
            </div>
        </el-card>
        <el-card class="module" shadow="hover">
            <span class="title" :style="myStyle">输入描述</span>
            <div class="content" v-highlight v-html="problemDetail.input_description"/>
            <span class="title" :style="myStyle">输出描述</span>
            <div class="content" v-highlight v-html="problemDetail.output_description"/>
            <el-row v-for="(sample,index) in problemDetail.samples" :key="index" :gutter="60">
                <el-col :span="10">
                    <span class="title" :style="myStyle">输入样例 {{index+1}} </span>
                    <el-button icon="iconfont j-icon-clipboard" @click="copyText(sample.input)"
                               class="icon-btn" type="text"/>
                    <pre class="sample">{{sample.input}}</pre>
                </el-col>
                <el-col :span="10">
                    <span class="title" :style="myStyle">输出样例 {{index+1}} </span>
                    <pre class="sample">{{sample.output}}</pre>
                </el-col>
            </el-row>
        </el-card>
        <el-card class="module" shadow="hover" v-if="problemDetail.hint">
            <span class="title" :style="myStyle">提示</span>
            <div class="content" v-highlight v-html="problemDetail.hint"/>
        </el-card>

        <el-card shadow="hover">
            <CodeMirror :value.sync="code"
                        :languages="problemDetail.languages"
                        :language="language"
                        @changeLang="onChangeLang"
                        @resetCode="onResetCode"/>
            <el-row type="flex" justify="space-between">
                <el-col :span="10">
                    <div class="status" v-if="statusVisible">
                        <span>提交状态</span>
                    </div>
                </el-col>
                <el-col :span="12">
                    <el-button type="warning" round icon="el-icon-edit" :loading="submitLoading"
                               @click="submitCode" style="float: right" size="medium">
                        <span v-if="submitLoading">正在提交</span>
                        <span v-else>提交</span>
                    </el-button>
                </el-col>
            </el-row>
        </el-card>
    </d2-container>
</template>

<script>
import * as clipboard from 'clipboard-polyfill'
import CodeMirror from '@oj/components/CodeMirror.vue'

export default {
  name: 'ProblemDetail',
  components: {
    CodeMirror
  },
  data () {
    return {
      myStyle: { color: '' },
      problemDetail: {},
      activeIndex: '1',
      code: '',
      language: '',
      statusVisible: false,
      submitLoading: false
    }
  },
  methods: {
    getProblem (id) {
      this.$api.problem.getProblem(id)
        .then(response => {
          this.problemDetail = response.data
          this.language = this.problemDetail.languages[0]
        })
    },
    copyText (text) {
      clipboard.writeText(text)
      this.$message({
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
    submitCode () {
      // TODO 提交代码
      if (this.code.trim() === '') {
        this.$message.error('不能提交空代码')
        return
      }
      this.submitLoading = true
      // let data = {
      //   problem_ID: this.problemDetail.problem_ID,
      //   language: this.language,
      //   code: this.code
      // }
      // const submitFunc = (data, detailVisible) => {
      // }
    }
  },
  mounted () {
    let load = this.$loading()
    if (this.$route.params.problemDetail && this.$route.params.problemDetail.ID === this.$route.params.id) {
      this.problemDetail = this.$route.params.problemDetail
      this.language = this.problemDetail.languages[0]
      load.close()
    } else {
      this.getProblem(this.$route.params.id)
      load.close()
    }
  },
  async created () {
    // 异步加载当前主题色
    this.myStyle.color = await this.$store.dispatch('oj/db/get', {
      dbName: 'sys',
      path: 'color.value',
      defaultValue: process.env.VUE_APP_ELEMENT_COLOR,
      user: true
    })
  }

}
</script>

<style scoped>
    .float-nav {
        padding: 10px 100px 0;
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
    }

    .header {
        font-size: 27px;
        font-weight: 400;
        color: #1b153b;
        line-height: 38px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    a {
        text-decoration: none;
        /*color: #2d8cf0;*/
    }

    a:hover {
        /*color: #57a3f3;*/
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
        font-size: 18px;
    }

    .module {
        padding: 30px 50px;
        margin-bottom: 20px;
    }

    .title {
        font-size: 20px;
        font-weight: 400;
        margin: 25px 0 8px;
        /*color: #3091f2*/
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
