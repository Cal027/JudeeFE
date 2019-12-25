<template>
    <div>
        <div style="z-index: 10;position: relative">
            <div style="text-align: center">
                <d2-icon-svg name="logo" class="nord-logo"/>
                <h3 style="font-weight: 300">一个基于Vue.js和Django的轻量级在线评测系统</h3>
            </div>
            <d2-icon-svg name="Nord-Ice-Footer" class="nord-ice"/>
            <h2>FAQ：</h2>
            <p>判题机为Linux系统</p>
            <p>Java: 主类名字请写更改为Main后再提交。Java提供3倍的时限</p>
            <p>Python3: Python不提供编译过程, 所以一切因为Python代码编写错误引发的错误, 均判为Runtime Error</p>
            <p>C++：支持__int128</p>
            <p>判题机会自动的去掉行末空格（不会去掉换行）</p>
            <br>
            <h3>编译参数:</h3>
            <p>待添加</p>
            <br>
            <h3>OJ 特色:</h3>
            <p>前后端分离，提高服务器性能</p>
            <p>支持多机器多进程判题，判题更高效</p>
            <p>支持 C/C++/Java/Python3</p>
            <p>支持 Special Judge</p>
            <p>一键保存和导出代码模板</p>
        </div>
        <MountainFooter/>
    </div>
</template>

<script>
import MountainFooter from '@oj/components/MountainFooter'

export default {
  name: 'Description',
  components: { MountainFooter }
}
</script>

<style scoped>
    .nord-logo {
        width: 250px;
        height: 75px;
        margin-top: 10px
    }
</style>
