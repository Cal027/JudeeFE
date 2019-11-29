<template>
    <d2-container ref="container">
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
                        <el-button class="add-btn" icon="el-icon-plus" circle size="mini" @click="addSample"/>
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
            <el-form-item prop="hint" label="提示" size="mini" style="width: 70%">
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
                <el-col :span="6">
                    <el-form-item prop="score" label="分数">
                        <el-input-number controls-position="right" v-model="form.score"
                                         :step="10" :min="0" :max="100">
                        </el-input-number>
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
                <el-col :span="12">
                    <el-form-item prop="tags" label="题目标签">
                        <el-select v-model="form.tags" clearable multiple style="width: 100%" placeholder="请选择标签">
                            <el-option
                                    v-for="item in tagNames"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-col :span="6">
                <el-form-item prop="is_public" label="开放权限">
                    <el-switch v-model="form.is_public" active-text="公开" inactive-text="私密"/>
                </el-form-item>
            </el-col>
            <el-form-item label="限制语言" prop="language">
                <el-checkbox-group v-model="form.languages">
                    <el-checkbox v-for="la in languageOptions" :label="la" :key="la">{{la}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="上传测试数据">
                <el-card style="width: 25%">
                    <el-upload style="text-align: center"
                               :action="uploadURL"
                               :data="{problem_ID: 7}"
                               :on-success="uploadSucceeded"
                               :on-error="uploadFailed">
                        <el-button round type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传zip文件，且不超过2MB</div>
                    </el-upload>
                </el-card>
            </el-form-item>
            <el-button round type="success" style="float:right;">添加题目</el-button>
        </el-form>
    </d2-container>
</template>

<script>
import problemAPI from '@admin/api/sys.problem'

const languageOptions = ['java', 'C', 'C++', 'python']
const diffOptions = [{ value: 1, label: '简单' }, { value: 2, label: '普通' }, { value: 3, label: '中等' },
  { value: 4, label: '困难' }, { value: 5, label: '非常困难' }]
export default {
  name: 'addProblem',
  data () {
    return {
      banner: {
        title: '添加题目',
        subTitle: '在这里可以添加OJ题目'
      },
      diffOptions,
      tagNames: [],
      activeItem: 0,
      form: {
        title: '',
        source: '',
        description: '',
        input_description: '',
        output_description: '',
        input_sample: '',
        output_sample: '',
        samples: [{ input: '', output: '' }],
        hint: '',
        difficulty: '3',
        is_public: true,
        time_limit: 1000,
        memory_limit: 32,
        tags: [],
        score: '0',
        languages: []
      },
      languageOptions,
      rules: {
        title: { required: true, message: '标题不能为空', trigger: 'blur' },
        description: { required: true, message: '描述不能为空', trigger: 'blur' },
        input_description: { required: true, message: '输入描述不能为空', trigger: 'blur' },
        output_description: { required: true, message: '输出描述不能为空', trigger: 'blur' },
        input_sample: { required: true, message: '样例输入不能为空', trigger: 'blur' },
        output_sample: { required: true, message: '样例输入不能为空', trigger: 'blur' },
        language: { required: true, message: '语言不能为空', trigger: 'blur' }
      },
      uploadURL: process.env.VUE_APP_API + '/upload_file/'
    }
  },
  mounted () {
    this.$refs.container.scrollToTop()
    // 获取标签
    problemAPI.getTags().then(res => {
      for (let i = 0; i < res.count; i++) {
        this.tagNames.push(res.results[i])
      }
    })
  },
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
    uploadSucceeded (response) {
      if (response.error) {
        this.$message.error(response.data)
      }
    },
    uploadFailed () {
      this.$message.error('上传失败')
    }
  }
}
</script>

<style lang="scss">
    .el-form-item__label {
        font-weight: 300;
        font-size: 18px;
    }

    .el-button--mini.is-circle {
        padding: 4px;
    }

    .banner {
        margin-bottom: 30px;
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

</style>
