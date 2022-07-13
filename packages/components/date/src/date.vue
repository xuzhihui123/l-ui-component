<template>
  <div>
    <el-date-picker v-model="value1" type="datetime" placeholder="Select date and time" />
  </div>
</template>

<script lang="ts" setup name="LDate">
import { ref } from "vue"
const value1 = ref("")
</script>
