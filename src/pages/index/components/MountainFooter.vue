<template>
    <div>
        <d2-icon-svg name="Nord-mountains" class="mountain"
                     :style="{'bottom':`${bottom}px`,'height':`${height}px`}"/>
        <resize-observer @notify="handleResize" />
    </div>
</template>

<script>
import 'vue-resize/dist/vue-resize.css'

export default {
  name: 'MountainFooter',
  data () {
    return {
      bottom: 0
    }
  },
  props: {
    height: {
      type: Number,
      default: 90
    },
    ratio: {
      type: Number
    }
  },
  methods: {
    handleResize () {
      this.bottom = Math.min((window.innerWidth * this.ratio / 15 - this.height) | 0, 0)
    }
  }
}
</script>

<style scoped>
    .mountain {
        width: 100%;
        position: absolute;
        left: 0;
        opacity: 0.9;
    }
</style>
