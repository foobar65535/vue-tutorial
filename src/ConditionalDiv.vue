<script setup lang="ts">
import {defineProps, onMounted} from 'vue';
const props = defineProps(['conditional']);

onMounted(() => {
  console.log("ConditionalDiv props", props);
});
</script>
<template>
  <template v-if="props.conditional">
    <div class="someclass" :class="$attrs.class">This div is conditionally shown</div>
  </template>
  <template v-else>
    <div class="someclass" :class="$attrs.class">This div is anti-conditionally shown</div>
  </template>
  <div>Conditional rendering can't be put on the outermost template</div>
</template>

<style scoped>
.someclass {
  border-bottom: 4px solid #80f;
}
</style>
