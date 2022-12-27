<script setup lang="ts">
import {computed, reactive, nextTick, ref} from 'vue';
import type {Ref} from 'vue';

import DivWithClasses from './DivWithClasses.vue';
import MultiDivWithClasses from './MultiDivWithClasses.vue';
import ConditionalDiv from './ConditionalDiv.vue';
import RandomDiv from './RandomDiv.vue';
import LifecycleBoxComposition from './LifecycleBoxComposition.vue';
import WatchBoxComposition from './WatchBoxComposition.vue';
import MultiDivSharedClass from './MultiDivSharedClass.vue';
import DivSharedClass from './DivSharedClass.vue';

const mutable = reactive({count: 0});
const getMutable = () => {
  return mutable.count;
};
const isEven = computed(() => {
  return mutable.count % 2 === 0 ? 'yes' : 'no';
});
const isEvenFlaky = computed(() => {
  return Math.random() >= 0.1 ? (mutable.count % 2 === 0 ? 'yes' : 'no') : 'lost';
});
const isEvenWrapped = {
  inner: computed(() => {
    return mutable.count % 2 === 0 ? 'yes' : 'no'
  })
};
const twoWay = {
  inner: computed({
    get() {
      return mutable.count;
    },
    set(val) {
      mutable.count = Math.floor(val * 10000);
    }
  })
};
const computedObj = computed(() => ({foo: Math.cos(mutable.count)}));
const map = reactive(new Map());
const someRef = ref(0);
const wrappedRef = {num: ref(0)};
const peeledWrappedRef = reactive({num: someRef});
const deepMutable = reactive({counts: {somecount: 0}});
const arrayRef = reactive([ref(0)]);
const mapRef = reactive(new Map([["foo", ref(Math.floor(Math.random() * 0.25))]]));
const classes = reactive({red: false, bold: false});
const bigness = ref(true);
const bignessStr = ref("bigness");
const arr = reactive([1, 2, 7]);
const arrOfObj = reactive([{foo: 3}, {foo: 5}, {foo: 9}]);
const arrayClasses = reactive(["red", "bigness"]);
const stringClasses = ref("red bigness");
const computedClasses = computed(() => {
  return {
    ...classes,
    bigness: bigness.value,
  };
});
let transformedRef = $ref(0);
const mutate = () => {
  mutable.count = mutable.count + 4;
};
const weirdMutate = () => {
  const weird = (layers: number) => {
    if (layers > 0) {
      mutable.count = mutable.count + 1;
    } else {
      return;
    }
    nextTick(() => {
      weird(layers - 1);
    });
  };
  weird(50000);
};
const disconnectRef = () => {
  // @ts-ignore
  peeledWrappedRef.num = ref(peeledWrappedRef.num);
};
const obj = reactive({
  foo: 'this is foo',
  bar: 'this is something else',
});
console.log("Deep mutable:", deepMutable);

const keyed = reactive(["foo", "bar", "baz"]);
const rotateKeyed = () => {
  keyed.unshift(keyed.pop()!);
};

const detectArr: Ref<number[]> = ref([]);
const detectArrEven = computed(() => detectArr.value.filter(x => x % 2 === 0).reverse());

const lifecycleBoxProp = ref('initial');
const updateProp = () => {
  lifecycleBoxProp.value = Math.random().toString(32);
};
const showLifecycleBox = ref(true);
</script>

<template>
  <div class="comproot">
    <div @click="mutable.count++">Plain: {{ mutable.count}}, from method: {{ getMutable()}}</div>
    <div>Computed is even ref {{ isEven}}</div>
    <div v-show="isEven === 'no'">Not even. This isEven is toggled using v-show</div>
    <div>Computed object {{ computedObj.foo}}</div>
    <div>
      <div v-if="mutable.count % 4 === 0">0 mod 4</div>
      <div v-else-if="mutable.count % 4 === 3">3 mod 4</div>
      <div v-else>Something else mod 4</div>
    </div>
    <p>v-if is evaluated before v-for</p>
    <ul>
      <li v-for="item in arr" v-if="isEven[0] === 'y'">{{ item}}</li>
    </ul>
    <button @click="computedObj = {foo: Math.floor(Math.random() * 100) - 500}">Mutate computed object</button>
    <div @click="twoWay.inner.value = Math.random()">Two way computed property {{ twoWay.inner}}</div>
    <div>Computed ref loses dependency tracking if dependency is not used in one invocation isEvenFlaky: {{
        isEvenFlaky
    }}</div>
    <div v-if="isEvenWrapped.inner.value === 'yes'">Computed is even ref wrapped {{ isEvenWrapped.inner}}</div>
    <button @click="mutate">Mutate me</button>
    <button @click="weirdMutate">Weird mutate me (slow)</button>
    <button @click="map.set(Math.random(), 3)">Add to map {{ map.size}}</button>
    <button @click="deepMutable.counts.somecount++">Deep mutable: {{ deepMutable.counts.somecount}}</button>
    <button @click="someRef++">This is a ref and it's implicitly unwrapped: {{ someRef}}</button>
    <button @click="wrappedRef.num.value++">This is a wrapped ref: {{ wrappedRef.num}} or {{ wrappedRef.num.value +
        0
    }}</button>
    <button @click="peeledWrappedRef.num++">This is a "peeled" wrapped ref: {{ peeledWrappedRef.num}}</button>
    <button @click="disconnectRef">Disconnect the ref</button>
    <button @click="arrayRef[0].value++">This ref exists in an array {{ arrayRef[0]}}</button>
    <button @click="mapRef.get('foo').value++">This ref exists in a map {{ mapRef.get("foo")}}</button>
    <button @click="transformedRef++">This ref looks like a value but is transformed during compilation
      {{ transformedRef}}</button>
    <hr />

    <button @click="(() => {debugger; Math.sqrt(3);})">What can I do inside an IIFE?</button>
    <hr />

    <div class="always" :class="computedClasses">This div has object class names</div>
    <button @click="classes.red = !classes.red">Toggle red</button>
    <button @click="classes.bold = !classes.bold">Toggle bold</button>
    <button @click="bigness = !bigness">Toggle bigness</button>
    <div class="always" :class="arrayClasses">This div has array class names</div>
    <div class="always" :class="[bignessStr]">This div has array ref class names</div>
    <div class="always" :class="[bignessStr, {red: true}]">This div has mixed array and object class names</div>
    <div class="always" :class="stringClasses">This div has string class names</div>
    <hr />

    <DivWithClasses class="always" :class="{bigness: bigness}" />
    <MultiDivWithClasses class="always" :class="{bigness: bigness}" />
    <hr />

    <div style="font-family: serif" :style="{fontSize: '125%'}">This div has inline styles</div>
    <div style="color: #fff" :style="{backgroundColor: '#000', 'background-color': '#00f'}">This div has conflicting
      inline styles for "background-color"</div>
    <div style="color: #fff" :style="{'background-color': '#00f', backgroundColor: '#000'}">This div has conflicting
      inline styles for "background-color"</div>
    <div style="color: #fff" :style="[{'background-color': '#00f'}, {backgroundColor: '#000'}]">This div has conflicting
      inline styles for "background-color"</div>
    <div style="color: #fff" :style="[{backgroundColor: '#000', fontStyle: 'italic'}, {'background-color': '#00f'}]">
      This div has conflicting inline styles for "background-color"</div>
    <div :style="{display: ['-weird-flex', 'flex']}">This has display: flex</div>
    <hr />

    <ConditionalDiv :conditional="isEven === 'yes'" />
    <ol>
      <li v-for="({foo}, i) in arrOfObj">{{ foo}}: <em>{{ i}}</em></li>
      <li v-for="({foo}, i) of arrOfObj">{{ foo}}: <em>{{ i}}</em> with alternate syntax</li>
    </ol>
    <p>
      Sadly complicated destructuring &lt;li v-for="({foo: bar}, i) in arrOfObj"&gt; is not supported.
    </p>
    <p>Object iteration</p>
    <ul>
      <li v-for="value in obj">Attempt A {{ value}}</li>
    </ul>
    <ul>
      <li v-for="(value) in obj">Attempt B {{ value}}</li>
    </ul>
    <ul>
      <li v-for="(value, key) in obj">Attempt C {{ value}} and {{ key}}</li>
    </ul>
    <ul>
      <li v-for="(value, key, index) in obj">Attempt D {{ value}} and {{ key}} with index {{ index}}</li>
    </ul>
    <ul>
      <li v-for="i in 4">Attempt Z {{ i}} WHY 1-based</li>
    </ul>
    <ol>
      <template v-for="i in 3">
        <li>Template item A {{ i}}</li>
        <li v-if="i % 2 === 1">Template item B odd only {{ i}}</li>
      </template>
    </ol>
    <hr />

    <RandomDiv v-for="name in keyed" :text="name" />
    <RandomDiv v-for="name in keyed" :key="name" :text="name + ' (keyed)'" />
    <button @click="rotateKeyed">Rotate</button>
    <hr />

    <button @click="detectArr.push(Math.floor(Math.random() * 100) + 100)">Push</button>
    <button @click="detectArr.pop()">Pop</button>
    <button @click="detectArr.unshift(-Math.floor(Math.random() * 100) - 100)">Unshift</button>
    <button @click="detectArr.shift()">Shift</button>
    <button @click="detectArr.splice(2, 1)">Remove third element</button>
    <button @click="detectArr.sort()">Sort</button>
    <button @click="detectArr.reverse()">Reverse</button>
    <button @click="detectArr = detectArr.map(x => x + 1)">Non mutating increment all</button>
    <ul>
      <li v-for="val in detectArr">{{ val}}</li>
    </ul>
    <p>Even members only and reversed</p>
    <ul>
      <li v-for="val in detectArrEven">{{ val}}</li>
    </ul>
    <hr />
    <LifecycleBoxComposition v-if="showLifecycleBox" :someprop="lifecycleBoxProp" />
    <button @click="updateProp">Update lifecycle box prop</button>
    <button @click="showLifecycleBox = !showLifecycleBox">Show/hide lifecycle box</button>
    <WatchBoxComposition />
    <MultiDivSharedClass />
    <DivSharedClass />
  </div>
</template>

<style scoped>
.comproot {
  border: 3px solid #f00;
}
</style>

<style>
.always {
  font-style: italic;
}

.red {
  color: #f00;
}

.bold {
  font-weight: 700;
}

.bigness {
  font-size: 0.5em;
}
</style>
