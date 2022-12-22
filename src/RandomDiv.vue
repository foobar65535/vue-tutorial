<script setup lang="ts">
const value = Math.random();
const props = defineProps(['text']);
</script>
<template>
  <div>This is random ({{text}}): {{value}}</div>
</template>

<style scoped>
.someclass {
  border-bottom: 4px solid #80f;
}
</style>
