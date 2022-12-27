<script setup lang="ts">
import {reactive, ref, watch, watchEffect, watchPostEffect, onUnmounted} from 'vue';
import type {WatchStopHandle} from 'vue';

const textRef = ref('');
const outputRef = ref('<initial>');
watch(textRef, (val, oldVal) => {
  const lenDiff = val.length - oldVal.length;
  if (lenDiff === 0) {
    outputRef.value = 'State Z';
  } else if ((lenDiff > 0 && lenDiff % 2 === 1) || (lenDiff < 0 && lenDiff % 2 === 0)) {
    outputRef.value = 'State A';
  } else {
    outputRef.value = 'State B';
  }
});

const obj = reactive({count: 0, other: 0});
const outputRefCtr = ref('<initial>');
let oldCount = obj.count;
watch(obj, (val) => {
  const n = val.count;
  const oldN = oldCount;
  oldCount = n;
  if (n === oldN) {
    outputRefCtr.value = 'Something else changed';
  } else if (n < oldN) {
    outputRefCtr.value = 'Decreased';
  } else {
    outputRefCtr.value = 'Increased';
  }
});
const fooCount = ref(0);
const barCount = ref(0);
const doubleOutput = ref('<initial>');
const productOutput = ref('<initial>');
watch([fooCount, barCount], ([foo, bar], [oldFoo, oldBar]) => {
  doubleOutput.value = foo !== oldFoo ? 'foo changed' : bar !== oldBar ? 'bar changed' : 'nothing changed';
});
watch(() => fooCount.value * barCount.value, (val, oldVal) => {
  productOutput.value = val > oldVal ? 'increased' : val < oldVal ? 'decreased' : 'something else';
});

const bazCount = ref(0);
const bazOutput = ref('<initial>');
const bazOutputFlaky = ref('<initial>')
watch(() => bazCount.value, (val, oldVal) => {
  bazOutput.value = val > oldVal ? 'increased' : val < oldVal ? 'decreased' : 'something else';
});
watch(
  () => {
    if (Math.random() < 0.1) {
      return undefined;
    }
    return bazCount.value
  },
  (val, oldVal) => {
    bazOutputFlaky.value = val === undefined
      ? 'disconnected'
      : val > oldVal
        ? 'increased'
        : val < oldVal
          ? 'decreased' : 'something else';
  }
);
const weirdObjInner = {num: 0};
const weirdObj = reactive({
  a: weirdObjInner,
  b: weirdObjInner,
  c: {...weirdObjInner},
});
const weirdObjTexts = reactive({
  nonDeep: '<initial>',
  deep: '<initial>',
});
watch(() => weirdObj.a, (val) => {
  weirdObjTexts.nonDeep = String(val.num);
});
watch(() => weirdObj.a, (val) => {
  weirdObjTexts.deep = String(val.num);
}, {deep: true});

(() => {
  console.log('Before registering watcher');
  watch(() => {
    console.log('Inside watcher getter function');
  }, () => {});
  console.log('After registering watcher');
})();

const effectRef = ref(0);
const effectElementRef = ref(null);
const effectOutput = ref('<initial>');
const effectOutputFlaky = ref('<initial>');
const effectOutputAsyncFirst = ref('<initial>');
const effectOutputAsyncSecond = ref('<initial>');
const effectOutputDom = ref('<initial>');
const effectOutputPost = ref('<initial>');
const effectOutputTimeout = ref('<initial>');
const outputTimeout = ref('<initial>');
watchEffect(() => {
  effectOutput.value = effectRef.value.toString(16);
});
watchEffect(() => {
  if (Math.random() >= 0.1) {
    effectOutputFlaky.value = effectRef.value.toString(16);
  }
});
watchEffect(async () => {
  effectOutputAsyncFirst.value = effectRef.value.toString(16);
  await Promise.resolve();
});
watchEffect(async () => {
  await Promise.resolve();
  effectOutputAsyncSecond.value = effectRef.value.toString(16);
});
watchEffect(() => {
  // This access exists just to establish watching
  effectRef.value;
  if (effectElementRef.value !== null) {
    effectOutputDom.value = `*${effectElementRef.value.textContent}*`;
  }
});
watchPostEffect(() => {
  // This access exists just to establish watching
  effectRef.value;
  if (effectElementRef.value !== null) {
    effectOutputPost.value = `*${effectElementRef.value.textContent}*`;
  }
});
let unwatcherW: WatchStopHandle | undefined;
let unwatcherE: WatchStopHandle | undefined;
let unmounted = false;
setTimeout(() => {
  if (!unmounted) {
    unwatcherW = watch(() => effectRef.value,
      () => {
        if (effectElementRef.value !== null) {
          outputTimeout.value = `%${effectElementRef.value.textContent}%`;
        }
      }
    );
    unwatcherE = watchEffect(() => {
      // This access exists just to establish watching
      effectRef.value;
      if (effectElementRef.value !== null) {
        effectOutputTimeout.value = `&${effectElementRef.value.textContent}&`;
      }
    });
  }
}, 0);
onUnmounted(() => {
  unmounted = true;
  if (unwatcherW) {
    unwatcherW();
    console.log('Unwatched asynchronously set watcher for watch');
  }
  if (unwatcherE) {
    unwatcherE();
    console.log('Unwatched asynchronously set watcher for watchEffect');
  }
});

const elementRef = ref<HTMLDivElement | null>(null);
const prePostRef = ref(0);
const prePostText = reactive({
  pre: '<initial>',
  post: '<initial>',
});
watch(prePostRef, () => {
  if (elementRef.value !== null) {
    prePostText.pre = elementRef.value.textContent;
  }
});
watch(prePostRef, () => {
  if (elementRef.value !== null) {
    prePostText.post = elementRef.value.textContent;
  }
}, {flush: 'post'});
</script>

<template>
  <div class="section-root">
    <h2>Watch Demo (Composition API)</h2>
    <input placeholder="Type into me" v-model="textRef" />
    <p>Watching a ref: {{ outputRef}}</p>
    <button @click.left="obj.count++" @click.right.prevent="obj.count--">Increment: {{ obj.count}}</button>
    <button @click="obj.other = Math.random()">Mutate other property</button>
    <p>Watching a ref: {{ outputRefCtr}}</p>
    <button @click.left="fooCount++" @click.right.prevent="fooCount--">Foo count: {{ fooCount}}</button>
    <button @click.left="barCount++" @click.right.prevent="barCount--">Bar count: {{ barCount}}</button>
    <p>Watching two items: {{ doubleOutput}}</p>
    <p>Watching a value computed from two refs: {{ productOutput}}</p>
    <button @click.left="bazCount++" @click.right.prevent="bazCount--">Baz count: {{ bazCount}}</button>
    <p>Watching using a callback: {{ bazOutput}}</p>
    <p>Watching using a flaky callback: {{ bazOutputFlaky}}. Similar to computed values, if a proxied value isn't
      accessed once, it's no longer monitored.</p>
    <hr />
    <button @click="weirdObj.a.num++">Increment through A {{ weirdObj.a.num}}</button>
    <button @click="weirdObj.b.num++">Increment through B {{ weirdObj.b.num}}</button>
    <button @click="weirdObj.c.num++">Increment C (not connected) {{ weirdObj.c.num}}</button>
    <p>Weird state (monitored through property a) nonDeep: {{ weirdObjTexts.nonDeep}}, deep: {{ weirdObjTexts.deep}}</p>
    <button @click="effectRef++">Increment effectRef {{ effectRef}}</button>
    <div ref="effectElementRef">{{ effectRef}}</div>
    <p>Value of effectOutput (updated through watchEffect): {{ effectOutput}}</p>
    <p>Value of effectOutputFlaky (updated through watchEffect): {{ effectOutputFlaky}}</p>
    <p>Updated through watchEffect, using an async function, before await: {{ effectOutputAsyncFirst}}</p>
    <p>Updated through watchEffect, using an async function, after await: {{ effectOutputAsyncSecond}}</p>
    <p>Updated through watchEffect and read from the DOM: {{ effectOutputDom}}</p>
    <p>Updated through watchPostEffect and read from the DOM: {{ effectOutputPost}}</p>
    <p>Updated through watch established through setTimeout: {{ outputTimeout}}</p>
    <p>Updated through watchEffect established through setTimeout: {{ effectOutputTimeout}}</p>
    <div ref="elementRef">{{ prePostRef}}</div>
    <button @click="prePostRef++">Update</button>
    <p>Pre: {{ prePostText.pre}}, post: {{ prePostText.post}}</p>
  </div>
</template>

<style scoped>
.section-root {
  border: 4px solid #8f0;
  background-color: #efd;
}
</style>
