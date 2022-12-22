<script lang="ts">
import {ref} from 'vue';

import OptionsApp from './OptionsApp.vue';
import CompositionApp from './CompositionApp.vue';
import CompositionNoSetupApp from './CompositionNoSetupApp.vue';

export default {
  setup() {
    const showAll = ref(true);
    return {showAll};
  },
  components: {OptionsApp, CompositionApp, CompositionNoSetupApp},
};
</script>

<template>
  <button @click="showAll=!showAll">Toggle all</button>
  <div v-if="showAll">
    <OptionsApp />
    <CompositionApp />
    <CompositionNoSetupApp />
  </div>
</template>

<style scoped>
</style>
