<template>
  <div>
    <el-date-picker v-model="value1" type="datetime" placeholder="Select date and time" />
  </div>
</template>

<script lang="ts" setup name="LDate">
import { ref } from "vue"
import cloneDeep from "lodash-es/cloneDeep"
console.log(cloneDeep({ name: 222 }))
const value1 = ref("")
</script>
