<template>
    <div id="app">
        <NavBar/>
        <el-backtop :bottom="50">
            <div class="back">
                <i class="el-icon-top"/>
            </div>
        </el-backtop>
        <div class="view">
            <transition name="el-fade-in-linear" mode="out-in">
                <router-view/>
            </transition>
        </div>
        <div class="footer">
            <WaveFooter/>
            <d2-icon-svg name="logo" class="logo"/>
            <div>
                <p class="page-login--content-footer-copyright">
                    Copyright
                    <d2-icon name="copyright"/>
                    2019 SUSTech Judee小组出品
                </p>
                <p class="page-login--content-footer-options">
                    <a href="https://github.com/Cal027/JudeeFE">帮助</a>
                    <a href="https://github.com/Cal027/JudeeFE">隐私</a>
                    <a href="https://github.com/Cal027/JudeeFE">条款</a>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import NavBar from './components/NavBar'
import WaveFooter from '@oj/components/WaveFooter'

export default {
  name: 'App',
  components: { WaveFooter, NavBar }
}
</script>

<style scoped lang="less">
    .el-dropdown-link {
        cursor: pointer;
        color: #409eff;
    }

    .back {
        height: 100%;
        width: 100%;
        background-color: #f2f5f6;
        border-radius: 50%;
        box-shadow: 0 0 6px rgba(0, 0, 0, .12);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
    }

    .view {
        margin-top: 85px;
        flex: 1 0 auto;
    }

    .footer {
        padding-bottom: 20px;
        width: 100%;
        flex-shrink: 0;
        background: #fbfbfc;

        .logo {
            margin-top: 30px;
            margin-bottom: -30px;
            height: 55px;
        }

        .page-login--content-footer-copyright {
            padding: 0;
            margin: 0 0 10px;
            font-size: 12px;
            line-height: 12px;
            text-align: center;
            color: #608290;

            a {
                color: #608290;
            }
        }

        .page-login--content-footer-options {
            padding: 0;
            margin: 0;
            font-size: 12px;
            line-height: 12px;
            text-align: center;

            a {
                color: #608290;
                margin: 0 1em;
            }
        }
    }

</style>
<style lang="less">
    @import '~@/assets/style/quill.css';
    html, body {
        height: 100%;
        background-color: #F2F4F8;
        color: #4C566A;

        #app {
            height: 100%;
            display: flex;
            flex-flow: column;
            font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
        }
    }

    #nprogress .bar {
        background: #446B84 !important;
    }
</style>
