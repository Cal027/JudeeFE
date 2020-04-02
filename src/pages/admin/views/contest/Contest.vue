<template>
    <d2-container>
        <d2-module-index-banner v-bind="banner"/>
        <el-form ref="form" style="margin: 0 auto;max-width: 90%"
                 :model="form" :rules="rules" label-position="top" label-width="90px">
            <el-form-item prop="title" label="标题" style="width: 50%">
                <el-input v-model="form.title" placeholder="这里输入题目"/>
            </el-form-item>
            <el-form-item prop="description" label="竞赛描述" size="mini" style="width: 70%">
                <d2-quill style="min-height: 250px;" v-model="form.description"/>
            </el-form-item>
            <el-form-item prop="password" label="竞赛密码" style="width: 30%">
                <el-input v-model="form.password" show-password placeholder="(可选) 竞赛密码"/>
            </el-form-item>
            <el-row type="flex" justify="space-between">
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
                        <el-radio v-model="form.rule_type" label="ACM" :disabled="disableRule">ACM</el-radio>
                        <el-radio v-model="form.rule_type" label="OI" :disabled="disableRule">OI</el-radio>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="允许IP范围">
                <div v-for="(range, index) in form.allowed_ip_ranges" :key="index">
                    <el-row :gutter="20" style="margin-bottom: 15px">
                        <el-col :span="8">
                            <el-input v-model="range.value" placeholder="CIDR Network"/>
                        </el-col>
                        <el-col :span="10">
                            <el-button type="primary" icon="el-icon-plus" circle size="mini"
                                       @click="addIPRange"/>
                            <el-button icon="el-icon-minus" circle size="mini" @click="removeIPRange(range)"/>
                        </el-col>
                    </el-row>
                </div>
            </el-form-item>
            <el-button round type="success" style="float:right;" @click="submitContest">{{btnTitle}}</el-button>
        </el-form>

    </d2-container>
</template>

<script>
import ContestAPI from '@admin/api/sys.contest'
import util from '@/utils/util'

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
      btnTitle: '添加竞赛',
      form: {
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        password: '',
        rule_type: 'ACM',
        allowed_ip_ranges: [{ value: '' }]
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
      this.$confirm(`是否确认${this.btnTitle}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            const data = Object.assign({}, this.form)
            const ranges = []
            for (const v of data.allowed_ip_ranges) {
              if (v.value !== '') {
                ranges.push(v.value)
              }
            }
            data.allowed_ip_ranges = ranges
            if (this.disableRule) {
              delete data.is_pwd
              delete data.id
              ContestAPI.editContest(this.$route.params.contestID, data).then(() => {
                this.$message({
                  message: '修改竞赛信息成功！',
                  type: 'success'
                })
              })
            } else {
              ContestAPI.addContest(data).then(() => {
                this.$message({
                  message: '添加竞赛信息成功！',
                  type: 'success'
                })
              })
            }
          } else {
            this.$message.error('提交失败!')
            return false
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交'
        })
      })
    },
    addIPRange () {
      this.form.allowed_ip_ranges.push({ value: '' })
    },
    removeIPRange (range) {
      const index = this.form.allowed_ip_ranges.indexOf(range)
      if (index !== -1) {
        this.form.allowed_ip_ranges.splice(index, 1)
      }
      if (this.form.allowed_ip_ranges.length === 0) {
        this.addIPRange()
      }
    }
  },
  mounted () {
    if (this.$route.name === 'edit-contest') {
      this.banner.title = '修改竞赛'
      this.banner.subTitle = '在这里可以修改OJ竞赛'
      this.btnTitle = '修改竞赛'
      this.disableRule = true
      ContestAPI.getContest(this.$route.params.contestID).then(res => {
        this.form = res
        this.form.start_time = util.time.resolveTime(this.form.start_time)
        this.form.end_time = util.time.resolveTime(this.form.end_time)
        if (this.form.allowed_ip_ranges.length === 0) {
          this.form.allowed_ip_ranges = [{ value: '' }]
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
