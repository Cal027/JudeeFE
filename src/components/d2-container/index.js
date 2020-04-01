// 组件
import d2ContainerFull from './components/d2-container-full.vue'
import d2ContainerGhost from './components/d2-container-ghost.vue'
import d2ContainerCard from './components/d2-container-card.vue'

export default {
  name: 'd2-container',
  props: {
    // 容器样式
    type: {
      type: String,
      required: false,
      default: 'full'
    }
  },
  computed: {
    // 始终返回渲染组件
    component () {
      if (this.type === 'card') return d2ContainerCard
      if (this.type === 'ghost') return d2ContainerGhost
      if (this.type === 'full') {
        return d2ContainerFull
      } else {
        return 'div'
      }
    }
  },
  render (h) {
    const slots = [this.$slots.default]
    if (this.$slots.header) slots.push(h('template', { slot: 'header' }, [this.$slots.header]))
    if (this.$slots.footer) slots.push(h('template', { slot: 'footer' }, [this.$slots.footer]))
    return h('div', {
      ref: 'container',
      class: 'container-component'
    }, [
      h(this.component, {
        ref: 'component',
        props: this.$attrs,
        on: {
          scroll: e => this.$emit('scroll', e)
        }
      }, slots)
    ])
  },
  methods: {
    // 返回顶部
    scrollToTop () {
      this.$refs.component.scrollToTop()
    },
    // 用法同原生方法 scrollBy
    scrollBy (x = 0, y = 0, time = 300) {
      this.$refs.component.$refs.body.scrollBy(x, y)
    },
    // 用法同原生方法 scrollTo
    scrollTo (x = 0, y = 0, time = 300) {
      this.$refs.component.$refs.body.scrollTo(x, y)
    },
    // 用法同原生方法 scrollTop
    scrollTop (top = 0, time = 300) {
      this.$refs.component.$refs.body.scrollTop = top
    }
  }
}
