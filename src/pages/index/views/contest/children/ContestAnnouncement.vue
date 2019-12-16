<template>
    <el-container style="height: 500px; border: 1px solid #eee">
        <el-card v-for="(r,index) in results" :key="index" shadow="always">
            index
        </el-card>
    </el-container>
</template>

<script>
import contestAPI from '@oj/api/oj.contest'
// FIXME 加载不进这个组件
export default {
  name: 'ContestAnnouncement',
  data () {
    return {
      loading: false,
      announcements: [],
      contestID: null
    }
  },
  methods: {
    getAnnouncement () {
      this.loading = true
      contestAPI.getContestAnnouncement(this.contestID).then(res => {
        this.announcements = res.results
        this.loading = false
      })
    }
  },
  mounted () {
    console.log('xxx')
    this.contestID = this.$route.params.contestID
    this.getAnnouncement()
  }
}

</script>

<style scoped>

</style>
