<template>
    <d2-icon-svg name="Nord-mountains" class="mountain" :style="{'bottom':bottom}"/>
</template>

<script>
export default {
  name: 'MountainFooter',
  props: {
    bottom: {
      type: String,
      default: '12px'
    }
  }
}
</script>

<style scoped>
    .mountain{
        width: 100%;
        position: absolute;
        left: 0;
        opacity: 0.9;
    }
</style>
