<script setup lang="ts">
import {reactive, onBeforeMount, onBeforeUpdate, onUpdated, onMounted, onBeforeUnmount, onUnmounted} from 'vue';
defineProps(['someprop']);
const obj = reactive({
  mountedText: "before mounted",
  beforeMountText: "before beforeMount",
  beforeUpdateText: "before beforeUpdate",
  updatedText: "before updated",
  internal: "initial",
});

onBeforeMount(() => {
  obj.beforeMountText = `beforeMount called at ${Date.now()}`;
});

onBeforeUpdate(() => {
  obj.beforeUpdateText = `beforeUpdate called at ${Date.now()}`;
});

onUpdated(() => {
  obj.updatedText = `updated called at ${Date.now()}`;
});

onMounted(() => {
  obj.mountedText = `mounted called at ${Date.now()}`;
});

onBeforeUnmount(() => {
  console.log(`Lifecycle box beforeUnmount at ${Date.now()}`);
});

onUnmounted(() => {
  console.log(`Lifecycle box unmounted at ${Date.now()}`);
});

const updateInternal = () => {
  obj.internal = Math.random().toString(32).toUpperCase();
};
</script>
<template>
  <div class="lifecycle-box">
    This box illustrates lifecycle hooks using the Options API
    <p>beforeMount: {{ obj.beforeMountText}}</p>
    <p>mounted: {{ obj.mountedText}}</p>
    <p>beforeUpdate: {{ obj.beforeUpdateText}}</p>
    <p>updated: {{ obj.updatedText}}</p>
    <p>This is an externally defined property: {{ someprop}}</p>
    <p>This is internally defined: {{ obj.internal}}</p>
    <button @click="updateInternal">Update</button>
  </div>
</template>

<style scoped>
.lifecycle-box {
  border: 2px solid #0c0;
  background-color: #efe;
  margin: 4px;
}
</style>
