<template>
  <el-calendar v-model="value" />
</template>

<script lang="ts" setup>
import { ref } from "vue"
import a from "./a.json"
console.log(a.name)
const value = ref(new Date())
</script>
