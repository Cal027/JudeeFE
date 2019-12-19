<template>
    <d2-container>
        <d2-module-index-banner v-bind="banner"/>
        <el-card class="content">
            <div slot="header">
                上传文件
            </div>
            <el-upload
                    drag
                    :headers="header"
                    :action="uploadURL"
                    :before-upload="onBeforeUpload"
                    :on-success="uploadSucceeded"
                    :on-error="uploadFailed">
                <i class="el-icon-upload"/>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
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
      uploadURL: process.env.VUE_APP_API + '/fps-import/',
      header: {
        Authorization: `JWT ${cookies.get('tokenAdmin')}`
      }
    }
  },
  methods: {
    onBeforeUpload () {

    },
    uploadSucceeded () {

    },
    uploadFailed () {

    }
  }
}
</script>

<style scoped>
    .content{
        width: 500px;
        height: 400px;
        margin: 0 auto;
        text-align: center;
    }
</style>
