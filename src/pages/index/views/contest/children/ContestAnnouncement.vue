<template>
    <div>
        <el-card v-if="total===0"  class="content">
            <template #header>
                暂无公告
            </template>
        </el-card>
        <el-card v-else v-for="(item,index) in announcements" :key="index" :name="index" class="content">
            <template #header>
                <div style="font-size: 24px">
                    <d2-icon name="bullhorn" style="margin-right: 10px;color: #C41832"/>
                    <span style="color: #C41832;">{{total-index}}: </span>{{item.title}}
                    <span class="right time">
                    <d2-icon name="clock-o"/>
                    {{resolveTime(item.create_time)}}
                </span>
                </div>
            </template>
            <div style="font-size: 16px" v-html="item.content"/>
        </el-card>
    </div>
</template>

<script>
import contestAPI from '@oj/api/oj.contest'
import util from '@/utils/util'

export default {
  name: 'ContestAnnouncement',
  data () {
    return {
      loading: false,
      announcements: [],
      contestID: null,
      total: 0
    }
  },
  methods: {
    getAnnouncement () {
      this.loading = true
      contestAPI.getContestAnnouncement(this.contestID).then(res => {
        this.total = res.count
        this.announcements = res.results
        this.loading = false
      })
    },
    resolveTime (time) {
      return util.time.resolveTime(time)
    }
  },
  mounted () {
    this.contestID = this.$route.params.contestID
    this.getAnnouncement()
  }
}

</script>

<style scoped>
    .content {
        width: 80%;
        padding-left: 50px;
        padding-right: 50px;
        margin: 0 auto 20px;
    }

    .right {
        float: right;
        margin-left: 10px;
    }

    .time {
        padding: 10px 10px;
        font-size: 14px;
    }
</style>
