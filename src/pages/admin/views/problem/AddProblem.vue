<template>
    <d2-container ref="container">
        <d2-module-index-banner v-bind="banner"/>
        <el-form ref="form" style="margin: 0 auto;max-width: 90%"
                 :model="form" :rules="rules" label-position="top" label-width="90px">
            <el-row :gutter="50">
                <el-col :span="6">
                    <el-form-item prop="author" label="作者">
                        <el-input v-model="form.author" placeholder="这里输入题目作者"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item prop="title" label="标题" >
                        <el-input v-model="form.title" placeholder="这里输入题目"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item prop="description" label="题目描述" size="mini" style="width: 65%">
                <d2-quill style="min-height: 200px;" v-model="form.description"></d2-quill>
            </el-form-item>
            <el-row type="flex" justify="space-between" >
                <el-col :span="11" >
                    <el-form-item prop="input_description" label="输入" size="mini">
                        <d2-quill style="min-height: 150px;" v-model="form.input_description"></d2-quill>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item prop="output_description" label="输出" size="mini">
                        <d2-quill style="min-height: 150px;" v-model="form.output_description"></d2-quill>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-form-item prop="input_sample" label="样例输入">
                        <el-input type="textarea" :autosize="{minRows: 2}" v-model="form.input_sample"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item prop="output_sample" label="样例输出" >
                        <el-input type="textarea" :autosize="{minRows: 2}" v-model="form.output_sample"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item prop="tips" label="提示" size="mini" style="width: 65%">
                <d2-quill style="min-height: 200px;" v-model="form.tips"></d2-quill>
            </el-form-item>
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-form-item prop="time_limit" label="时间限制(MS)">
                        <el-input-number  controls-position="right" v-model="form.time_limit" :step="1000" step-strictly></el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item prop="memory_limit" label="内存限制(MB)" >
                        <el-input-number controls-position="right" v-model="form.memory_limit" :step="16"></el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item prop="score" label="分数" >
                        <el-input-number controls-position="right" v-model="form.score"
                                         :step="10" min="0" max="100">
                        </el-input-number>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-form-item prop="difficulty" label="难度">
                        <el-select v-model="form.difficulty" clearable placeholder="请选择难度">
                            <el-option
                                    v-for="item in diff_opt"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item prop="permission" label="开放权限">
                        <el-select v-model="form.permission" clearable placeholder="请选择权限">
                            <el-option
                                    v-for="item in per_opt"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item prop="tags" label="题目标签">
                        <el-select v-model="form.tags" clearable multiple placeholder="请选择标签">
                            <el-option
                                    v-for="item in tag_opt"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="上传测试数据">
                <el-card style="width: 25%">
                    <el-upload style="text-align: center">
                        <el-button round  type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传zip文件，且不超过2MB</div>
                    </el-upload>
                </el-card>
            </el-form-item>
            <el-button round type="success"  style="float:right;">添加题目</el-button>
        </el-form>
    </d2-container>
</template>

<script>
export default {
  name: 'addProblem',
  data () {
    return {
      banner: {
        title: '添加题目',
        subTitle: '在这里可以添加OJ题目'
      },
      diff_opt:
       [{ value: '1',
         label: '简单' },
       { value: '2',
         label: '普通' },
       { value: '3',
         label: '中等' },
       { value: '4',
         label: '困难' },
       { value: '5',
         label: '非常困难' }],
      per_opt:
       [{ value: '1',
         label: '公开' },
       { value: '2',
         label: '课程' },
       { value: '3',
         label: '比赛' },
       { value: '4',
         label: '私密' }],
      tag_opt:
       [{ value: '1',
         label: '搜索' },
       { value: '2',
         label: '图论' },
       { value: '3',
         label: '贪心' },
       { value: '4',
         label: '分治' },
       { value: '5',
         label: '线性规划' }],
      form: {
        author: '',
        title: '',
        description: '',
        input_description: '',
        output_description: '',
        input_sample: '',
        output_sample: '',
        tips: '',
        languages: '',
        difficulty: '3',
        permission: '1',
        time_limit: 1000,
        memory_limit: 32,
        tags: '',
        score: '0'
      },
      rules: {
        author: { required: true, message: '作者不能为空', trigger: 'blur' },
        title: { required: true, message: '标题不能为空', trigger: 'blur' },
        description: { required: true, message: '描述不能为空', trigger: 'blur' },
        input_description: { required: true, message: '输入描述不能为空', trigger: 'blur' },
        output_description: { required: true, message: '输出描述不能为空', trigger: 'blur' },
        input_sample: { required: true, message: '样例输入不能为空', trigger: 'blur' },
        output_sample: { required: true, message: '样例输入不能为空', trigger: 'blur' }
      }
    }
  },
  mounted () {
    this.$refs.container.scrollToTop()
  }
}
</script>

<style lang="scss">
.el-form-item__label{
    font-weight: 300;
    font-size: 18px;
}
.banner{
    margin-bottom: 30px;
}

</style>
