<template>
    <div>
        <div style="z-index: 10;position: relative;">
            <div style="text-align: center">
                <d2-icon-svg name="logo" class="nord-logo"/>
                <h3 style="font-weight: 300">一个基于Vue.js和Django的轻量级在线评测系统</h3>
                <d2-icon-svg name="Nord-Ice-Footer" class="nord-ice"/>
            </div>
            <h3>OJ 特色:</h3>
            <ul>
                <li><p>网站采用
                    <el-link href="https://www.nordtheme.com/" target="_blank">
                        <d2-icon-svg name="Nord"
                                     style="width: 14px;height: 14px;margin-right: 3px"/>
                        <span style="font-size: 16px">Nord</span>
                    </el-link>
                    配色方案, 并可更换主题色
                </p></li>
                <li><p>前后端分离，提高服务器性能</p></li>
                <li><p>OJ前台和管理后台分离</p></li>
                <li><p>支持评测机docker镜像快速部署</p></li>
                <li><p>Redis做缓存，不再担心高并发</p></li>
                <li><p>支持多机器多进程判题，判题更高效</p></li>
                <li><p>支持 C/C++/Java/Python3</p></li>
            </ul>
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
</style>
