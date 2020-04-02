<template>
    <div style="margin: 0 0 15px 0">
        <el-row type="flex" justify="space-between" class="header">
            <el-col :span=12>
                <div>
                    <span>语言:</span>
                    <el-select size="small" :value="language" @change="onLangChange" class="adjust">
                        <el-option v-for="item in languages" :key="item" :value="item"/>
                    </el-select>

                    <el-tooltip content="返回默认代码设置" placement="top" style="margin-left: 10px">
                        <el-button round size="small" icon="el-icon-refresh-left" @click="onResetClick"/>
                    </el-tooltip>

                    <el-tooltip content="上传代码" placement="top" style="margin-left: 10px">
                        <el-button round size="small" icon="el-icon-upload" @click="onUploadFile"/>

                    </el-tooltip>
                    <input type="file" id="file-uploader" style="display: none" @change="onUploadFileDone"/>
                </div>
            </el-col>
            <el-col :span=12>
                <div class="fl-right">
                    <span>编辑器主题:</span>
                    <el-select size="small" v-model="theme" @change="onThemeChange" class="adjust">
                        <el-option v-for="item in themes" :key="item.value" :value="item.value" :label="item.label"/>
                    </el-select>
                </div>
            </el-col>
        </el-row>
        <codemirror :value="value" :options="options" @change="onEditorCodeChange" ref="myEditor">
        </codemirror>
    </div>
</template>
<script>
import { codemirror } from 'vue-codemirror-lite'

// theme
import 'codemirror/theme/darcula.css'
import 'codemirror/theme/solarized.css'
import 'codemirror/theme/material.css'
import 'codemirror/theme/3024-day.css'
import 'codemirror/theme/nord.css'

// mode
import 'codemirror/mode/clike/clike.js'
import 'codemirror/mode/python/python.js'

// active-line.js
import 'codemirror/addon/selection/active-line.js'

// foldGutter
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/brace-fold.js'
import 'codemirror/addon/fold/indent-fold.js'

export default {
  name: 'CodeMirror',
  components: {
    codemirror
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    languages: {
      type: Array,
      default: () => {
        return ['C', 'C++', 'Java', 'Python3']
      }
    },
    language: {
      type: String,
      default: 'C++'
    }
    // theme: {
    //   type: String,
    //   default: 'material'
    // }
  },
  data () {
    return {
      theme: 'nord',
      options: {
        // codemirror options
        tabSize: 4,
        mode: 'text/x-c++src',
        theme: 'nord',
        lineNumbers: true,
        line: true,
        // 括号匹配
        matchBrackets: true,
        // 代码折叠
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        // 选中文本自动高亮，及高亮方式
        styleSelectedText: true,
        lineWrapping: true,
        highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true }
      },
      mode: {
        C: 'text/x-csrc',
        'C++': 'text/x-c++src',
        Python3: 'text/x-python',
        Java: 'text/x-java'
      },
      themes: [
        { label: 'Nord', value: 'nord' },
        { label: '3024-day', value: '3024-day' },
        { label: 'Solarized', value: 'solarized' },
        { label: 'Darcula', value: 'darcula' },
        { label: 'Material', value: 'material' }
      ]
    }
  },
  mounted () {
    // this.editor.focus()
  },
  methods: {
    onEditorCodeChange (newCode) {
      this.$emit('update:value', newCode)
    },
    onLangChange (newVal) {
      this.editor.setOption('mode', this.mode[newVal])
      this.$emit('changeLang', newVal)
    },
    onThemeChange (newTheme) {
      this.editor.setOption('theme', newTheme)
      this.$emit('changeTheme', newTheme)
    },
    onResetClick () {
      this.$emit('resetCode')
    },
    onUploadFile () {
      document.getElementById('file-uploader').click()
    },
    onUploadFileDone () {
      const f = document.getElementById('file-uploader').files[0]
      const fileReader = new window.FileReader()
      const self = this
      fileReader.onload = function (e) {
        var text = e.target.result
        self.editor.setValue(text)
        document.getElementById('file-uploader').value = ''
      }
      fileReader.readAsText(f, 'UTF-8')
    }
  },
  computed: {
    editor () {
      // get current editor object
      return this.$refs.myEditor.editor
    }
  },
  watch: {
    'theme' (newVal, oldVal) {
      this.editor.setOption('theme', newVal)
    }
  }
}
</script>

<style lang="less" scoped>
    .header {
        margin: 5px 5px 15px 5px;

        .adjust {
            width: 150px;
            margin-left: 10px;
        }

        .fl-right {
            float: right;
        }
    }
</style>

<style>
    .CodeMirror {
        height: auto !important;
    }

    .CodeMirror-scroll {
        min-height: 300px;
        max-height: 1000px;
    }
</style>
