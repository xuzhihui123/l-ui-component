<template>
  <i :class="[iconName,'dd']" :style="style">
      <slot></slot>
      <img src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1114%2F0G020114924%2F200G0114924-15-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1659592019&t=eb7bf4978017a23a571357857cea7ac1" alt="">
  </i>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { iconProps } from "./icon";


export default defineComponent({
  name: "LIcon",
  props: iconProps,
  setup(props) {
      const style = computed(() => {
          if(!props.size && !props.color){
              return {}
          }
          return {
              ...(props.size ? { 'font-size':props.size + 'px'} : {}),
              ...(props.color ? { 'color':props.color} : {}),
          }
      })
      const iconName = computed(()=>{
          return 'l-icon-' + props.name
      })

      return { style,iconName }
  },
});
</script>



