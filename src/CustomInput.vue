<script setup lang="ts">
// it doesn't seem to matter how this is defined
defineProps([(()=>'modelValq'.replace(/q/, 'ue'))()]);
defineEmits(['update:modelValue']);
</script>
<template>
  <div>
    I'm a custom input blah blah <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
    I'm a custom input blah blah
  </div>
</template>

<style scoped>
.someclass {
  border-bottom: 4px solid #80f;
}
</style>
