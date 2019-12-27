<template>
    <d2-container>
        <d2-module-index-banner v-bind="banner"/>
        <el-card class="content">
            <template #header>
                上传文件
            </template>
            <el-upload
                    drag
                    :headers="header"
                    :action="uploadURL"
                    :before-upload="onBeforeUpload"
                    :on-success="uploadSucceeded"
                    :on-error="uploadFailed">
                <i class="el-icon-upload"/>
                <div class="el-upload__text">只能上传xml格式文件。将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
        </el-card>
        <el-card v-for="(item, index) in testCasesInfo" :key="index" class="box-card">
            <span v-if="item.length===0">此题为Special judge，暂不支持</span>
            <div v-else >
                <el-table
                        :data="item"
                        stripe
                        style="width: 100%">
                    <el-table-column
                            prop="input_name"
                            align="center"
                            label="输入文件名">
                    </el-table-column>
                    <el-table-column
                            prop="input_size"
                            align="center"
                            label="输入文件大小">
                    </el-table-column>
                    <el-table-column
                            prop="output_name"
                            align="center"
                            label="输出文件名">
                    </el-table-column>
                    <el-table-column
                            prop="output_size"
                            align="center"
                            label="输出文件大小">
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
    </d2-container>
</template>

<script>
import cookies from '@/utils/util.cookies'

export default {
  name: 'ProblemImport',
  data () {
    return {
      banner: {
        title: '导入题目',
        subTitle: '在这里可以添加FPS格式的题目'
      },
      uploadURL: process.env.VUE_APP_BASE_URL + '/fps-import/',
      header: {
        Authorization: `JWT ${cookies.get('tokenAdmin')}`
      },
      // showDialog: false,
      testCasesInfo: []
    }
  },
  methods: {
    onBeforeUpload (file) {
      const isXml = file.type === 'text/xml'
      if (!isXml) {
        this.$message.error('必须为xml文件')
      }
      return isXml
    },
    uploadSucceeded (response) {
      if (response.error) {
        this.$message.error(response.data)
      }
      this.$message.success(`成功导入${response.import_count}道题！`)
      this.testCasesInfo = response.info
      // this.showDialog = true
    },
    uploadFailed (err) {
      this.$message.error(err.message)
    }
  }
}
</script>

<style scoped>
    .content{
        width: 500px;
        height: 350px;
        margin: 30px auto 0;
        text-align: center;
    }
    .box-card {
        margin: 30px auto 0;
        width: 600px;
    }
</style>
