<template>
    <d2-container class="add-problem">
        <d2-module-index-banner v-bind="banner"/>
        <el-form ref="form" style="margin: 0 auto;max-width: 90%"
                 :model="form" :rules="rules" label-position="top" label-width="90px">
            <el-form-item prop="title" label="标题" style="width: 50%">
                <el-input v-model="form.title" placeholder="这里输入题目"/>
            </el-form-item>
            <el-form-item prop="source" label="来源" style="width: 50%">
                <el-input v-model="form.source" placeholder="这里输入来源"/>
            </el-form-item>
            <el-form-item prop="description" label="题目描述" size="mini" style="width: 70%">
                <d2-quill style="min-height: 250px;" v-model="form.description"/>
            </el-form-item>
            <el-row type="flex" justify="space-between">
                <el-col :span="11">
                    <el-form-item prop="input_description" label="输入" size="mini">
                        <d2-quill style="min-height: 200px;" v-model="form.input_description"/>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item prop="output_description" label="输出" size="mini">
                        <d2-quill style="min-height: 200px;" v-model="form.output_description"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <div style="margin-bottom: 50px">
                <div style="position: relative">
                    <label class="el-form-item__label">样例</label>
                    <el-tooltip content="添加一个样例" placement="left">
                        <el-button class="add-btn" type="primary" icon="el-icon-plus" circle size="mini"
                                   @click="addSample"/>
                    </el-tooltip>
                    <el-tooltip content="删除当前样例">
                        <el-button class="del-btn" icon="el-icon-minus" circle size="mini" @click="delSample"/>
                    </el-tooltip>
                </div>
                <el-form-item prop="samples" required>
                    <el-collapse v-model="activeItem" accordion>
                        <el-collapse-item v-for="(sample,index) in form.samples"
                                          :key="'sample'+index" :name="index"
                                          :title="'样例 '+(index+1)">
                            <el-row :gutter="50">
                                <el-col :span="8">
                                    <el-form-item prop="input_sample" label="样例输入">
                                        <el-input type="textarea" :autosize="{minRows: 2}" v-model="sample.input"/>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item prop="output_sample" label="样例输出">
                                        <el-input type="textarea" :autosize="{minRows: 2}" v-model="sample.output"/>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-collapse-item>
                    </el-collapse>
                </el-form-item>
            </div>
            <el-form-item v-for="(score,index) in form.test_case_score" :key="index"
                          :prop="'test_case_score.' + index" :label="'测试用例 '+(index+1)+' 分数'">
                <el-input-number controls-position="right" v-model="form.test_case_score[index]"
                                 :step="10" :min="0" :max="100" size="small"/>
            </el-form-item>
            <el-form-item>
                <el-button @click="addTestScore" size="small" round type="primary">新增用例分数</el-button>
                <el-button @click="delTestScore" circle icon="el-icon-minus" size="small"/>
            </el-form-item>
            <el-form-item label="提示" size="mini" style="width: 70%">
                <d2-quill style="min-height: 200px;" v-model="form.hint"/>
            </el-form-item>
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-form-item prop="time_limit" label="时间限制(MS)">
                        <el-input-number :min="0" controls-position="right" v-model="form.time_limit" :step="1000"
                                         step-strictly/>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item prop="memory_limit" label="内存限制(MB)">
                        <el-input-number :min="0" controls-position="right" v-model="form.memory_limit" :step="16"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-form-item prop="difficulty" label="难度">
                        <el-select v-model="form.difficulty" clearable placeholder="请选择难度">
                            <el-option
                                    v-for="item in diffOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="!isContest">
                    <el-form-item prop="tags" label="题目标签">
                        <el-select v-model="form.tags" clearable
                                   allow-create multiple filterable
                                   default-first-option style="width: 100%" placeholder="请选择标签或输入新标签">
                            <el-option
                                    v-for="item in tagNames"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="开放权限">
                        <el-switch active-text="公开" inactive-text="私密" v-model="form.is_public"/>
                    </el-form-item>
                </el-col>
                <el-col :span="18">
                    <el-form-item label="限制语言" prop="languages">
                        <el-checkbox-group v-model="form.languages">
                            <el-checkbox v-for="la in languageOptions" :label="la" :key="la">{{la}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-dialog width="25%" title="上传测试数据"
                       :close-on-click-modal="false"
                       :close-on-press-escape="false"
                       :before-close="handleClose"
                       :visible.sync="test_case_dialog" center>
                <el-upload style="text-align: center"
                           :action="uploadURL"
                           :data="uploadArg"
                           :headers="uploadHeader"
                           accept=".zip"
                           :before-upload="onBeforeUpload"
                           :on-success="uploadSucceeded"
                           :on-error="uploadFailed">
                    <el-button round type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传zip文件,内部格式应为1.in,1.out依此类推</div>
                </el-upload>
            </el-dialog>
            <el-button v-if="!isEdit" round type="success" style="float:right;" @click="submitProblem">添加题目</el-button>
            <el-button v-if="isEdit" round type="success" style="float:right;" @click="updateProblem">更新题目</el-button>
            <el-button round type="primary"
                       v-show="continue_flag" style="float:right;margin-right: 20px"
                       @click="test_case_dialog=true">{{uploadTxt}}
            </el-button>
        </el-form>
    </d2-container>
</template>

<script>
import problemAPI from '@admin/api/sys.problem'
import cookies from '@/utils/util.cookies'
import { languageOptions } from '@/utils/util.const'

const diffOptions = [{ value: 1, label: '简单' }, { value: 2, label: '普通' }, { value: 3, label: '中等' },
  { value: 4, label: '困难' }, { value: 5, label: '非常困难' }]

export default {
  name: 'Problem',
  data () {
    var checkSample = (rule, value, callback) => {
      if (value.length < 1) {
        return callback(new Error('样例不能为空'))
      }
      for (const obj of value) {
        if (obj.input === '' || obj.output === '') {
          return callback(new Error('输入或输出不能为空'))
        }
      }
      callback()
    }
    return {
      banner: {
        title: '添加题目',
        subTitle: '在这里可以添加OJ题目'
      },
      diffOptions,
      tagNames: [],
      activeItem: 0,
      isPublic: true,
      isEdit: false,
      isContest: false,
      submitName: '添加题目',
      form: {
        title: '',
        source: '',
        description: '',
        input_description: '',
        output_description: '',
        samples: [{ input: '', output: '' }],
        hint: '',
        difficulty: 3,
        is_public: true,
        time_limit: 1000,
        memory_limit: 32,
        tags: [],
        test_case_score: [10],
        languages: []
      },
      languageOptions,
      rules: {
        title: { required: true, message: '标题不能为空', trigger: 'blur' },
        description: { required: true, message: '描述不能为空', trigger: 'blur' },
        samples: { validator: checkSample, trigger: 'blur' },
        languages: { required: true, message: '语言不能为空', trigger: 'blur' }
      },
      uploadURL: process.env.VUE_APP_BASE_URL + '/upload_file/',
      uploadHeader: {},
      uploadArg: {},
      uploadTxt: '继续上传',
      test_case_dialog: false,
      continue_flag: false
    }
  },
  mounted () {
    this.getTags()
    this.initUpload()

    if (this.$route.name === 'edit-contest-problem') {
      this.isContest = true
    }
    if (this.$route.name === 'edit-problem' || this.$route.name === 'edit-contest-problem') {
      this.isEdit = true
      this.continue_flag = true
      this.uploadArg.problem_ID = this.$route.params.problemID
      this.uploadTxt = '更新测试数据'
      this.banner = { title: '修改题目', subTitle: '在这里修改题目信息' }
      problemAPI.getProblem(this.$route.params.problemID).then(res => {
        this.form = res
        const tags = this.form.tags
        this.form.tags = []
        for (const tag of tags) {
          this.form.tags.push(tag.name)
        }
      })
    }
  },
  // 上传校验
  methods: {
    delSample () {
      if (this.form.samples.length === 1) {
        this.$message.error('至少有一个样例')
      } else {
        this.form.samples.splice(this.activeItem, 1)
      }
    },
    addSample () {
      this.form.samples.push({ input: '', output: '' })
    },
    addTestScore () {
      this.form.test_case_score.push(10)
    },
    delTestScore () {
      if (this.form.test_case_score.length === 1) {
        this.$message.error('至少有一个测试用例')
      } else {
        this.form.test_case_score.splice(this.form.test_case_score.length - 1, 1)
      }
    },
    initUpload () {
      const token = cookies.get('tokenAdmin')
      this.uploadHeader.Authorization = `JWT ${token}`
    },
    uploadSucceeded (response) {
      if (response.error) {
        this.$message.error(response.data)
      }
      this.$message({
        message: '添加测试用例数据！',
        type: 'success'
      })
      this.test_case_dialog = false
      this.continue_flag = false
    },
    uploadFailed (err) {
      if (err.message === '"Wrong filename format"') {
        this.$message.error('压缩文件名格式错误！')
      } else if (err.message === '"Bad zip file"') {
        this.$message.error('文件格式必须为ZIP！')
      } else if (err.message === '"Wrong case number"') {
        this.$message.error('测试用例数量不一致！')
      } else if (err.message === '"No such problem"') {
        this.$message.error('没有对应的题目！')
      } else {
        this.$message.error('未知上传错误')
      }
      this.continue_flag = true
    },

    onBeforeUpload (file) {
      const isZip = file.type === 'application/x-zip-compressed'
      if (!isZip) {
        this.$message.error('必须为zip压缩文件')
      }
      return isZip
    },
    handleClose (done) {
      this.$confirm('确认放弃上传？').then(() => {
        done()
        this.continue_flag = true
      }).catch(() => {
      })
    },
    // 获取标签
    getTags () {
      problemAPI.getTags().then(res => {
        for (let i = 0; i < res.count; i++) {
          this.tagNames.push(res.results[i])
        }
      })
    },
    // 提交题目信息
    submitProblem () {
      this.$confirm('是否确认提交题目？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            problemAPI.addProblem(this.form).then(res => {
              this.uploadArg.problem_ID = res
              this.test_case_dialog = true
              this.$message({
                message: '添加题目信息成功！',
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
    },
    updateProblem () {
      this.$confirm('是否确认更新题目？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            problemAPI.updateProblem(this.$route.params.problemID, this.form).then(res => {
              this.$message({
                message: '修改题目信息成功！',
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
          message: '已取消更新'
        })
      })
    }
  }
}
</script>

<style lang="less">
    .banner {
        margin-bottom: 30px;
    }

    .add-problem{
        .el-form-item__label {
            font-weight: 300;
            font-size: 18px;
        }

        .el-button--mini.is-circle {
            padding: 4px;
        }

        .add-btn {
            position: absolute;
            bottom: 30%;
            right: 30px;
        }

        .del-btn {
            position: absolute;
            bottom: 30%;
            right: 0;
        }
    }

</style>
