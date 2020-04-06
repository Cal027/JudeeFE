<template>
    <div>
        <div :class="isSticky? 'float': 'nav'"
             :style="{'margin-top':top+'px','border-bottom': themeColor +' solid','border-width':'2px'}"
             :sticky-z-index="999"
             v-sticky on-stick="handleSticky" sticky-offset="{top:-44}">
            <div class="header">
                <span style="font-size: 24px">{{contestDetail.title}}</span>
                <el-button v-if="!contestDetail.is_in" type="text"
                           style="font-size:16px; float: right"
                           @click="joinContest">加入竞赛</el-button>
            </div>
            <el-menu
                    :default-active="$route.name"
                    mode="horizontal"
                    router
                    text-color="#1b153b"
                    class="menu"
                    background-color="transparent">
                <el-menu-item index="Contest-detail" class="menuItem"
                              :route="{name:'Contest-detail',params:{contestID:ID}}">首页
                </el-menu-item>
                <el-menu-item index="Contest-problems" class="menuItem"
                              :route="{name:'Contest-problems',params:{contestID:ID}}">问题列表
                </el-menu-item>
                <el-menu-item index="Contest-submissions-mine" class="menuItem"
                              :route="{name:'Contest-submissions-mine',params:{contestID:ID}}">我的提交
                </el-menu-item>
                <el-menu-item index="Contest-rank" class="menuItem"
                              :route="{name:'Contest-rank',params:{contestID:ID}}">排名
                </el-menu-item>
                <el-menu-item index="Contest-announcement" class="menuItem"
                              :route="{name:'Contest-announcement',params:{contestID:ID}}">公告
                </el-menu-item>
                <span   v-if="getStatus(contestDetail.start_time,contestDetail.end_time)===2"
                        :style="{right: isSticky? '100px':'0'}"
                        style="position: absolute;bottom: 15px">
                    <d2-icon style="margin-right: 2px" name="clock-o"/>倒计时: {{getCountdown()}}
                </span>
            </el-menu>
        </div>
        <div>
            <template v-if="routeName==='Contest-detail'">
                <ul class="contest-info">
                    <li>
                        <i class="el-icon-date" :style="{color:themeColor}"/>{{resolveTime(contestDetail.start_time)}}
                    </li>
                    <li>
                        <i class="el-icon-date" :style="{color:themeColor}"/>{{resolveTime(contestDetail.end_time)}}
                    </li>
                    <li>
                        <i class="el-icon-alarm-clock" :style="{color:themeColor}"/>
                        {{getDuration(contestDetail.start_time,contestDetail.end_time)}}
                    </li>
                    <li><i class="el-icon-price-tag" :style="{color:themeColor}"/>{{contestDetail.rule_type}}</li>
                    <li>
                        <i class="el-icon-connection" :style="{color:themeColor}"/>
                        {{contestDetail.is_in? '已加入':'未加入'}}
                    </li>
                    <li><i class="el-icon-user" :style="{color:themeColor}"/>{{contestDetail.created_by}}</li>
                </ul>
                <el-card class="card-module">
                    <span class="title" :style="{color:themeColor}">竞赛说明</span>
                    <div class="content" v-hlql v-html="contestDetail.description"/>
                </el-card>
            </template>
            <!--Children-->
            <transition v-else name="el-fade-in-linear" mode="out-in">
                <router-view/>
            </transition>
            <!--ChildrenEnd-->
        </div>
    </div>
</template>

<script>
import util from '@/utils/util'
import ContestAPI from '@oj/api/oj.contest'
import dayjs from 'dayjs'

export default {
  name: 'ContestDetail',
  computed: {
    getCountdown () {
      return function () {
        return util.time.countdown(this.now, this.contestDetail.end_time)
      }
    }
  },
  data () {
    return {
      themeColor: '',
      contest: '',
      ID: '',
      now: null,
      routeName: '',
      contestDetail: {},
      activeIndex: '1',
      top: -10,
      isSticky: false
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
    getDuration (startTime, endTime) {
      return util.time.duration(startTime, endTime)
    },
    resolveTime (time) {
      return util.time.resolveTime(time)
    },
    getStatus (begin, end) {
      return util.time.compareTime(begin, end)
    },
    joinContest () {
      ContestAPI.joinContest(this.ID).then(() => {
        this.$notify({
          type: 'success',
          title: '加入成功',
          message: '你已成功加入竞赛'
        })
        this.contestDetail.is_in = true
      })
    }
  },
  mounted () {
    this.ID = this.$route.params.contestID
    this.routeName = this.$route.name
    setInterval(() => {
      this.now = dayjs()
    }, 1000)

    ContestAPI.getContest(this.ID).then(res => {
      this.contestDetail = res
      this.$store.commit('oj/contest/setContest', this.contestDetail)
      util.title(this.contestDetail.title)
    }).catch(() => {
      this.$prompt('竞赛受保护，请输入密码加入竞赛', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            ContestAPI.joinContestWithPwd(this.ID, instance.inputValue).then(res => {
              this.contestDetail = res
              util.title(this.contestDetail.title)
              this.$message({
                type: 'success',
                message: '成功加入竞赛'
              })
              this.contestDetail.is_in = true
              done()
            }).catch(err => {
              this.$message({
                type: 'error',
                message: err.response.data
              })
            })
          } else {
            done()
            this.$router.back()
          }
        }
      })
    })
  },
  watch: {
    '$route' (newVal) {
      this.routeName = newVal.name
      this.ID = newVal.params.contestID
    }
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

    .menu {
        border-bottom: none;
    }

    .menuItem:hover {
        background: #fff !important;
    }

    .menuItem {
        font-size: 16px;
    }

    .title {
        font-size: 20px;
        font-weight: 400;
        margin: 25px 0 8px;
        /*color: #3091f2*/
    }

    .contest-info {
        background-color: #fff;
        width: 80%;
        padding: 5px 50px;
        margin: -10px auto 0;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);

        li {
            display: inline-block;
            margin-right: 30px;
            font-size: 16px;
            font-weight: 400;
            color: #3e3e3e;
            line-height: 33px;

            i {
                margin-right: 5px;
            }
        }
    }

</style>
