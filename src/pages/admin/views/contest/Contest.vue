<template>
    <d2-container>
        <d2-module-index-banner v-bind="banner"/>
        <el-form ref="form" style="margin: 0 auto;max-width: 90%"
                 :model="form" :rules="rules" label-position="top" label-width="90px">
            <el-form-item prop="title" label="标题" style="width: 50%">
                <el-input v-model="form.title" placeholder="这里输入题目"/>
            </el-form-item>
            <el-form-item prop="password" label="竞赛密码" style="width: 30%">
                <el-input v-model="form.password" show-password/>
            </el-form-item>
            <el-form-item prop="description" label="竞赛描述" size="mini" style="width: 70%">
                <d2-quill style="min-height: 250px;" v-model="form.description"/>
            </el-form-item>
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-form-item prop="start_time" label="开始时间">
                        <el-date-picker
                                v-model="form.start_time"
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm"
                                placeholder="竞赛开始时间"/>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item prop="end_time" label="结束时间">
                        <el-date-picker
                                v-model="form.end_time"
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm"
                                placeholder="竞赛结束时间"/>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="竞赛赛制">
                        <el-radio v-model="form.rule" label="ACM" :disabled="disableRule">ACM</el-radio>
                        <el-radio v-model="form.rule" label="OI" :disabled="disableRule">OI</el-radio>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-button round type="success" style="float:right;" @click="submitContest">添加竞赛</el-button>
        </el-form>

    </d2-container>
</template>

<script>
import ContestAPI from '@admin/api/sys.contest'

export default {
  name: 'Contest',
  data () {
    var checkDate = (rule, value, callback) => {
      if (value <= this.form.start_time) {
        return callback(new Error('结束时间不能早于开始时间'))
      } else {
        callback()
      }
    }
    return {
      disableRule: false,
      banner: {
        title: '添加竞赛',
        subTitle: '在这里可以添加OJ竞赛'
      },
      form: {
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        password: '',
        rule: 'ACM'
      },
      rules: {
        title: { required: true, message: '标题不能为空', trigger: 'blur' },
        description: { required: true, message: '描述不能为空', trigger: 'blur' },
        start_time: { required: true, message: '开始时间不能为空', trigger: 'blur' },
        end_time: [{ required: true, message: '结束时间不能为空', trigger: 'blur' },
          { validator: checkDate, trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitContest () {
      console.log(this.form.start_time)
      this.$confirm('是否确认提交竞赛？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            // TODO 添加竞赛API
            ContestAPI.addContest(this.from).then(res => {
              this.$message({
                message: '添加竞赛信息成功！',
                type: 'success'
              })
            })
          } else {
            this.$message.error('添加失败!')
            return false
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交'
        })
      })
    }
  },
  mounted () {
    if (this.$route.name === 'edit-contest') {
      this.banner.title = '修改竞赛'
      this.banner.subTitle = '在这里可以修改OJ竞赛'
      this.disableRule = true
      ContestAPI.getContest(this.$route.params.contestId).then(res => {
        this.form = res
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>

</style>
