import { defineComponent, type PropType, type VNode } from 'vue'

/** Рендерить VNode або рядок, які повернула функція cell стовпця. */
export default defineComponent({
  name: 'KiteRenderNode',
  props: { node: { type: [Object, String] as PropType<VNode | string>, required: true } },
  setup(props) {
    return () => props.node
  },
})
