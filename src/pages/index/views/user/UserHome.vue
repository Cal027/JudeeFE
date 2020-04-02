<template>
    <div>
        <SquareBackground/>
        <div class="container">
            <div class="avatar-container">
                <el-avatar :src="avatarUrl" :size="140"/>
            </div>
            <el-card :body-style="{ padding: '100px' }">
                <router-link to="/setting/profile">
                    <el-button icon="el-icon-edit-outline" v-if="isShowEdit" type="text" class="editProf">修改信息
                    </el-button>
                </router-link>
                <router-link to="/setting/password">
                    <el-button icon="el-icon-edit" v-if="isShowEdit" type="text" class="editPass">修改密码</el-button>
                </router-link>
                <p style="margin-top: -10px;">
                    <el-row>
                        <span class="emphasis">{{ username }}</span>
                    </el-row>
                    <el-row>
                        <el-tooltip :content="profile.email" class="item" placement="bottom">
                            <i class="iconfont j-icon-mail-fill" @click="copyText(profile.email)"/>
                        </el-tooltip>
                        <el-tooltip :content="phone_number" class="item" placement="bottom">
                            <i class="iconfont j-icon-phone-fill" @click="copyText(phone_number)"/>
                        </el-tooltip>
                        <el-tooltip :content="qq" class="item"
                                    style="margin-left: 5px;margin-right: 5px"
                                    placement="bottom">
                            <i class="iconfont j-icon-QQ" @click="copyText(qq)"/>
                        </el-tooltip>
                        <el-tooltip :content="github" class="item" placement="bottom">
                            <i class="iconfont j-icon-github-fill"/>
                        </el-tooltip>
                    </el-row>
                </p>

                <el-divider/>

                <el-row type="flex">
                    <el-col>
                        <p>提交次数</p>
                        <p class="emphasis">{{ userData.submit }}</p>
                    </el-col>
                    <el-col class="middle">
                        <p>AC次数</p>
                        <p class="emphasis">{{ userData.ac }}</p>
                    </el-col>
                    <el-col class="middle">
                        <p>分数</p>
                        <p class="emphasis">{{ userData.score }}</p>
                    </el-col>
                    <el-col>
                        <p>排名</p>
                        <p class="emphasis">{{ userData.ranking }}</p>
                    </el-col>
                </el-row>
                <el-divider content-position="center">个人简介</el-divider>
                <div>{{profile.desc?profile.desc:'这家伙很懒,连屁也没有放个就走了'}}</div>
                <el-divider content-position="center">近七天统计数据</el-divider>
                <ve-line :data="chartData" :settings="{
                axisSite: { right: ['rate'] },
                yAxisType: ['normal', 'percent'],
                yAxisName: ['次数', '比率']}"/>
                <el-divider content-position="center">通过题目 ({{userData.ac_prob.length}}道)</el-divider>
                <el-tag class="click"
                        v-for="item in userData.ac_prob" :key="item"
                        @click="clickProblem(item)">{{item}}
                </el-tag>
            </el-card>
        </div>
    </div>
</template>

<script>
import * as clipboard from 'clipboard-polyfill'
import SquareBackground from '@oj/components/SquareBackground'
import util from '@/utils/util'
import userAPI from '@oj/api/oj.user'
import { mapState, mapActions } from 'vuex'
import VeLine from 'v-charts/lib/line.common'
import md5 from 'js-md5'

export default {
  name: 'Profile',
  components: { SquareBackground, VeLine },
  computed: {
    ...mapState('oj/user', [
      'info'
    ]),
    isShowEdit () {
      return this.info.username === this.username
    }
  },
  data () {
    return {
      chartData: { columns: ['date', 'submit', 'ac', 'rate'], rows: [] },
      avatarUrl: '',
      username: '',
      profile: {},
      userData: {
        username: '',
        ac: 0,
        submit: 0,
        score: 0,
        ranking: 10000,
        ac_prob: []
      },
      github: '还没填写Github信息',
      qq: '还没填写QQ信息',
      phone_number: '还没填写电话号码'
    }
  },
  mounted () {
    this.username = this.$route.params.username
    util.title(this.username)
    userAPI.getUserInfo(this.username).then(res => {
      this.profile = res
      if (this.profile.qq_number) {
        this.qq = this.profile.qq_number
      }
      if (this.profile.github_username) {
        this.github = this.profile.github_username
      }
      if (this.profile.phone_number) {
        this.phone_number = this.profile.phone_number
      }
      if (this.isShowEdit) {
        this.avatarUrl = this.info.avatarUrl
      } else {
        this.avatarUrl = `https://www.gravatar.com/avatar/${md5(this.profile.email ? this.profile.email.toLowerCase() : '')}.jpg?s=140&d=${encodeURI('https://files.catbox.moe/9aciic.png')}`
      }
    })
    userAPI.getUserData(this.username).then(res => {
      this.userData.username = res.username
      this.userData.ac = res.ac
      this.userData.submit = res.submit
      this.userData.score = res.score
      this.userData.ranking = res.ranking + 1
      if (res.ac_prob) {
        this.userData.ac_prob = res.ac_prob.split('|')
        // 删除最后一个空值
        this.userData.ac_prob.splice(-1, 1)
      }
      if (this.isShowEdit) {
        this.updateAC(res.ac_prob)
      }
    })
    this.getStatisticInfo(7)
  },
  methods: {
    ...mapActions('oj/user', [
      'updateAC'
    ]),
    copyText (text) {
      clipboard.writeText(text)
      this.$message({
        message: '已复制到剪贴板！',
        type: 'success'
      })
    },
    clickProblem (problem) {
      this.$router.push({
        name: 'ProblemDetail',
        params: { id: problem }
      })
    },
    getStatisticInfo (offset) {
      userAPI.getStatisticInfo(this.username, offset).then(res => {
        this.chartData.rows = res
      })
    }
  }
}
</script>

<style lang="less" scoped>
    .container {
        position: relative;
        width: 75%;
        margin: 170px auto;
        text-align: center;

        .avatar-container {
            position: absolute;
            left: 50%;
            transform: translate(-50%);
            z-index: 1;
            top: -90px;

            .el-avatar {
                box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
            }
        }

        #608290 {
            margin-bottom: 20px;
        }

        .editProf {
            margin-top: 10px;
            margin-right: 20px;
            position: absolute;
            top: 0;
            right: 0;
        }

        .editPass {
            margin-top: 10px;
            margin-right: 20px;
            position: absolute;
            top: 30px;
            right: 0;
        }

        .emphasis {
            font-size: 25px;
            font-weight: 600;
        }

        .item {
            font-size: 20px;
        }

        .middle {
            border-left: 1px solid #DCDFE6;
            border-right: 1px solid #DCDFE6;
        }
    }

    .click {
        cursor: pointer;
        margin-bottom: 3px;
        margin-right: 5px;
    }

</style>
