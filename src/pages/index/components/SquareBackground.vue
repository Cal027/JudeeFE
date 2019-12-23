<template>
    <div style="z-index: 0;">
        <div class="page-login--layer page-login--layer-area">
            <ul class="circles">
                <li v-for="n in 10" :key="n" :style="{background: color}"/>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
  name: 'SquareBackground',
  data () {
    return {
      color: '#f2f1f6'
    }
  },
  async created () {
    // 异步加载当前主题色
    this.color = await this.$store.dispatch('oj/db/get', {
      dbName: 'oj',
      path: 'color.value',
      defaultValue: process.env.VUE_APP_COLOR,
      user: true
    })
  }
}
</script>

<style lang="scss" scoped>
    // 层
    .page-login--layer {
        @extend %full;
        overflow: auto;
    }

    .page-login--layer-area {
        overflow: hidden;
    }
    // 背景
    .circles {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        margin: 0;
        padding: 0;

        li {
            position: absolute;
            display: block;
            list-style: none;
            width: 20px;
            height: 20px;
            animation: animate 25s linear infinite;
            bottom: -200px;
            @keyframes animate {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 1;
                    border-radius: 0;
                }
                100% {
                    transform: translateY(-1000px) rotate(720deg);
                    opacity: 0;
                    border-radius: 50%;
                }
            }

            &:nth-child(1) {
                left: 15%;
                width: 80px;
                height: 80px;
                animation-delay: 0s;
            }

            &:nth-child(2) {
                left: 5%;
                width: 20px;
                height: 20px;
                animation-delay: 2s;
                animation-duration: 12s;
            }

            &:nth-child(3) {
                left: 70%;
                width: 20px;
                height: 20px;
                animation-delay: 4s;
            }

            &:nth-child(4) {
                left: 40%;
                width: 60px;
                height: 60px;
                animation-delay: 0s;
                animation-duration: 18s;
            }

            &:nth-child(5) {
                left: 65%;
                width: 20px;
                height: 20px;
                animation-delay: 0s;
            }

            &:nth-child(6) {
                left: 75%;
                width: 150px;
                height: 150px;
                animation-delay: 3s;
            }

            &:nth-child(7) {
                left: 35%;
                width: 200px;
                height: 200px;
                animation-delay: 7s;
            }

            &:nth-child(8) {
                left: 50%;
                width: 25px;
                height: 25px;
                animation-delay: 15s;
                animation-duration: 45s;
            }

            &:nth-child(9) {
                left: 20%;
                width: 15px;
                height: 15px;
                animation-delay: 2s;
                animation-duration: 35s;
            }

            &:nth-child(10) {
                left: 85%;
                width: 150px;
                height: 150px;
                animation-delay: 0s;
                animation-duration: 11s;
            }
        }
    }
</style>
