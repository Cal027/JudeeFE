<template xmlns:el-col="http://www.w3.org/1999/html">
    <d2-container>
        <template slot="header">添加题目</template>
        <el-form ref="form" style="margin: 0 auto;max-width: 90%"
                 :model="form" :rules="rules" label-position="top" label-width="80px">
            <el-form-item prop="title" label="标题">
                <el-input v-model="form.title" placeholder="这里输入题目"></el-input>
            </el-form-item>
            <el-form-item prop="description" label="题目描述" size="mini" >
                <d2-quill style="min-height: 200px;" v-model="form.description"></d2-quill>
            </el-form-item>
            <el-row type="flex" justify="space-between" >
                <el-col :span="11" >
                    <el-form-item prop="input_description" label="样例输入" size="mini">
                        <d2-quill style="min-height: 180px;" v-model="form.input_description"></d2-quill>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item prop="output_description" label="样例输出" size="mini">
                        <d2-quill style="min-height: 180px;" v-model="form.output_description"></d2-quill>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </d2-container>
</template>

<script>
import D2Quill from '@admin/components/d2-quill/index'
export default {
  name: 'addProblem',
  components: { D2Quill },
  data () {
    return {
      form: {
        title: '',
        description: '',
        input_description: '',
        output_description: '',
        samples: '',
        languages: '',
        difficulty: '',
        time_limit: ''
      },
      rules: {
        title: { required: true, message: '标题不能为空', trigger: 'blur' },
        description: { required: true, message: '描述不能为空', trigger: 'blur' },
        input_description: { required: true, message: '输入描述不能为空', trigger: 'blur' },
        output_description: { required: true, message: '输出描述不能为空', trigger: 'blur' }

      }
    }
  }
}
</script>

<style scoped>

</style>
