<script lang="ts">
export default {
  props: ['someprop'],
  data() {
    return {
      beforeCreateText: "before beforeCreate",
      createdText: "before created",
      mountedText: "before mounted",
      beforeMountText: "before beforeMount",
      beforeUpdateText: "before beforeUpdate",
      updatedText: "before updated",
      internal: "initial",
    };
  },
  beforeCreate() {
    console.log("Before create, reactive properties have not been initialized yet:", this.beforeCreateText);
    this.beforeCreateTime = Date.now();
  },
  created() {
    this.createdText = `mounted called at ${Date.now()}`;
  },
  beforeMount() {
    this.beforeMountText = `beforeMount called at ${Date.now()}`;
  },
  beforeUpdate() {
    this.beforeUpdateText = `beforeUpdate called at ${Date.now()}`;
  },
  updated() {
    this.updatedText = `updated called at ${Date.now()}`;
  },
  mounted() {
    if (this.beforeCreateTime !== undefined) {
      this.beforeCreateText = `beforeCreate called at ${this.beforeCreateTime}`;
    } else {
      this.beforeCreateText = "it seems beforeCreated was not called";
    }
    this.mountedText = `mounted called at ${Date.now()}`;
  },
  beforeUnmount() {
    console.log(`Lifecycle box beforeUnmount at ${Date.now()}`);
  },
  unmounted() {
    console.log(`Lifecycle box unmounted at ${Date.now()}`);
  },
  methods: {
    updateInternal() {
      this.internal = Math.random().toString(32).toUpperCase();
    },
  },
};
</script>
<template>
  <div class="lifecycle-box">
    This box illustrates lifecycle hooks using the Options API
    <p>beforeCreate: {{ beforeCreateText}} (updated from mounted)</p>
    <p>created: {{ createdText}}</p>
    <p>beforeMount: {{ beforeMountText}}</p>
    <p>mounted: {{ mountedText}}</p>
    <p>beforeUpdate: {{ beforeUpdateText}}</p>
    <p>updated: {{ updatedText}}</p>
    <p>This is an externally defined property: {{ someprop}}</p>
    <p>This is internally defined: {{ internal}}</p>
    <button @click="updateInternal">Update</button>
  </div>
</template>

<style scoped>
.lifecycle-box {
  border: 2px solid #08f;
  background-color: #def;
  margin: 4px;
}
</style>
