<script lang="tsx">
import { computed, defineComponent } from "vue"
import { iconProps } from "./icon"

export default defineComponent({
  name: "LIcon",
  props: iconProps,
  setup(props) {
    const style = computed(() => {
      if (!props.size && !props.color) {
        return {}
      }
      return {
        ...(props.size ? { "font-size": props.size + "px" } : {}),
        ...(props.color ? { color: props.color } : {})
      }
    })
    const iconName = computed(() => {
      return "l-icon-" + props.name
    })

    return { style, iconName }
  },
  methods: {},
  render() {
    return <i class={[this.iconName]} style={this.style}></i>
  }
})
</script>
