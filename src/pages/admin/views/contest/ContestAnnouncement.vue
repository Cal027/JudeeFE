<template>
    <d2-container>
        <d2-module-index-banner v-bind="banner"/>
        <el-card v-if="announcements.length===0">
            <template #header>
                <span class="title">暂无公告</span>
            </template>
        </el-card>
        <el-card v-for="(item,index) in announcements" class="container"
                 :key="index" :name="index">
            <template #header>
                <div  class="title">
                    <d2-icon name="bullhorn" style="margin-right: 10px;color: #0078D7"/>
                    <span style="color: #0078D7;">{{total-index}}: </span>{{item.title}}
                    <el-button class="right" @click="deleteAnn(item.id)" type="text"
                               icon="el-icon-close" size="medium">删除
                    </el-button>
                    <el-button class="right" @click="goEdit(item)" type="text"
                               icon="el-icon-edit" size="medium">编辑
                    </el-button>
                    <span class="right time">
                    <d2-icon name="clock-o"/>
                    {{resolveTime(item.create_time)}}
                </span>
                </div>
            </template>
            <div class="content" v-html="item.content"/>
        </el-card>
        <el-dialog :visible.sync="showDialog"
                   :close-on-click-modal="false"
                   :title="title" width="60%">
            <el-form :model="form" label-position="top" label-width="90px">
                <el-form-item label="标题">
                    <el-input v-model="form.title" placeholder="请输入公告标题"/>
                </el-form-item>
                <el-form-item label="内容" size="mini">
                    <d2-quill v-model="form.content" style="min-height: 250px"/>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button round size="small" @click="showDialog=false">取 消</el-button>
                <el-button v-if="isEdit" round type="success" size="small" @click="submitEdit">保 存</el-button>
                <el-button v-else round type="success" size="small" @click="submitAdd">添 加</el-button>
            </span>
        </el-dialog>

        <div class="float-button">
            <el-tooltip content="添加公告">
                <el-button @click="goAdd" type="primary" circle icon="el-icon-plus" size="medium"/>
            </el-tooltip>
        </div>
    </d2-container>
</template>

<script>
import API from '@admin/api/sys.contest'
import util from '@/utils/util'

export default {
  name: 'ContestAnnouncement',
  data () {
    return {
      banner: {
        title: '竞赛公告管理',
        subTitle: '在这里可以管理竞赛公告'
      },
      total: 0,
      title: '',
      isEdit: true,
      showDialog: false,
      announcements: [],
      form: {}
    }
  },
  methods: {
    goEdit (item) {
      this.isEdit = true
      this.title = '编辑公告'
      this.form = Object.assign({}, item)
      this.showDialog = true
    },
    goAdd () {
      this.isEdit = false
      this.title = '添加公告'
      this.form = {}
      this.form.contest = this.$route.params.contestID
      this.showDialog = true
    },
    submitEdit () {
      this.$confirm('是否确认保存公告？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API.updateAnnouncement(this.form.id, this.form).then(() => {
          this.$message({
            type: 'success',
            message: '更新公告成功！'
          })
          this.getAnnouncement()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交'
        })
      })
    },
    submitAdd () {
      this.$confirm('是否确认添加公告？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API.addAnnouncement(this.form).then(() => {
          this.$message({
            type: 'success',
            message: '添加公告成功！'
          })
          this.getAnnouncement()
          this.showDialog = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消添加'
        })
      })
    },
    deleteAnn (id) {
      this.$confirm('是否确认删除公告？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API.deleteAnnouncement(id).then(() => {
          this.$message({
            type: 'success',
            message: '删除公告成功！'
          })
          this.getAnnouncement()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    resolveTime (time) {
      return util.time.resolveTime(time)
    },
    getAnnouncement () {
      API.getContestAnnouncement(this.$route.params.contestID).then(res => {
        this.total = res.count
        this.announcements = res.results
      })
    }
  },
  mounted () {
    this.getAnnouncement()
  }
}
</script>

<style scoped lang="less">
    .container {
        /*width: 95%;*/
        /*position: relative;*/
        /*margin: 0 auto 20px;*/
        margin-bottom: 20px;

        .title {
            font-size: 22px;
        }

        .content {
            font-size: 16px
        }

        .right {
            float: right;
            margin-left: 10px;
        }

        .time {
            padding: 10px 10px;
            font-size: 14px;
        }
    }

    .editor {
        min-height: 250px;
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
