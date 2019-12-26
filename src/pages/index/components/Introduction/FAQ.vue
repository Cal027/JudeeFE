<template>
    <div>
        <div style="z-index: 10;position: relative">
            <div style="text-align: center">
                <d2-icon-svg name="logo" class="nord-logo"/>
                <h3 style="font-weight: 300">一个基于Vue.js和Django的轻量级在线评测系统</h3>
<!--                <d2-icon-svg name="Nord-Ice-Footer" class="nord-ice"/>-->
            </div>
            <h2>FAQ：</h2>
            <p>判题机为Linux系统</p>
            <p>Java: 主类名字请写更改为Main后再提交。Java提供3倍的时限</p>
            <p>Python3: Python不提供编译过程, 所以一切因为Python代码编写错误引发的错误, 均判为Runtime Error</p>
            <p>C++：支持__int128</p>
            <p>判题机会自动的去掉行末空格（不会去掉换行）</p>
            <br>
            <h3>编译参数:</h3>
            <ul>
                <li>
                    <p>C ( GCC 7.4 )</p>
                    <code>timeout 10 gcc {src_path} -fmax-errors=3 -o {exe_path} -O2 -std=c11</code>
                </li>
                <li>
                    <p>C++ ( G++ 7.4 )</p>
                    <code>timeout 10 g++ {src_path} -fmax-errors=3 -o {exe_path} -O2 -std=c++14</code>
                </li>
                <li>
                    <p>Java ( OpenJDK 1.8 )</p>
                    <code>javac {src_path} -d {exe_dir}</code>
                </li>
                <li>
                    <p>Python3 ( Python 3.6 )</p>
                    <code>python3 -m py_compile {src_path}</code>
                </li>
            </ul>
            <br>
            <h3>评测结果</h3>
            <ul>
                <li><p>Pending & Judging：您的提交将很快得到判定，请等待结果。</p></li>
                <li><p>Compile Error：无法编译您的源代码。 单击链接以查看编译器的输出。</p></li>
                <li><p>Accepted：恭喜你 您的答案是正确的。</p></li>
                <li><p>Wrong Answer：程序的输出与标准答案不匹配。</p></li>
                <li><p>Runtime Error：您的程序异常终止。 可能的原因是：存储器区段错误，被零除或终止代码非0。</p></li>
                <li><p>Time Limit Exceeded：您的程序使用的CPU时间已超出限制。</p></li>
                <li><p>Memory Limit Exceeded: 您的程序实际使用的内存已超出限制。</p></li>
                <li><p>System Error: 糟糕，判题机出了点问题。 请将此报告给管理员。</p></li>
            </ul>
        </div>
        <MountainFooter/>
    </div>
</template>

<script>
import MountainFooter from '@oj/components/MountainFooter'
export default {
  name: 'FAQ',
  components: { MountainFooter }
}
</script>

<style scoped>

</style>
