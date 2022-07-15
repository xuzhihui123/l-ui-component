



## 1.组件测试

::: demo
```vue
<el-button>222</el-button>
<br/>
<l-icon color="orange" name="arrow-double-right" size={30}></l-icon>
```
:::


::: demo
```vue
<template>
 <div class="c1">
   2222
 </div>
</template>
<script setup>
 import {ref} from 'vue'
 console.log(ref([{name:123}]));
</script>
<style lang="scss">
.c1{
  color:red
}
</style>
```
:::