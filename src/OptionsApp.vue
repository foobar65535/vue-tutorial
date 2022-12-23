<script lang="ts">
import LifecycleBoxOptions from './LifecycleBoxOptions.vue';
export default {
  components: {
    LifecycleBoxOptions,
  },
  data() {
    return {
      count: 0,
      html: `<span style="font-weight: 700">Hello</span>`,
      placeholder: "Some text",
      truthy: true,
      falsy: null,
      weird: '',
      complex: {placeholder: "foo"},
      datafunc: () => "Func",
      toggly: true,
      rand: 0.0,
      whichevent: "keydown",
      useless: null,
      dynamic: "Dynamic",
      obj: {},
      arr: [1, 2, 3],
      lifecycleBoxProp: "initial",
      showLifecycleBox: true,
    };
  },
  computed: {
    iAmComputed() {
      return this.rand ** 2;
    },
    twoWay: {
      get()  {
        return 5;
      },
      set(val) {
        this.count += val;
      },
    }
  },
  methods: {
    error() {
      throw new Error("Throw an error");
    },
    increment() {
      this.count++;
    },
    printThis: () => {
      console.log("`this` is wrong in an arrow function", this);
    },
    printArrayPush() {
      console.log("Push method of reactive array is", this.arr.push);
    },
    sneakyArrayPush() {
      const p = Array.prototype.push;
      p.call(this.arr, 33, 24);
    },
    arrayPush() {
      this.arr.push(22);
    },
    setArrayLength() {
      this.arr.length = Math.floor(Math.random() * 30 + 100);
    },
    arrayReverse() {
      this.arr.reverse();
    },
    updateProp() {
      this.lifecycleBoxProp = Math.random().toString(32);
    },
  },
  watch: {
    count(...args) {
      console.log("Watch count", args);
    }
  },
  created() {
    console.log("Options app instance created");
    this.specificIncrement = () => {
      this.count++;
    };
  },
  mounted() {
    this.dynamic = this.dynamic + this.dynamic;
    const obj = {};
    this.obj = obj;
    console.log("Object has been reactified", obj !== this.obj);
  },
  unmounted() {
    console.log("Options app instance unmounted");
  }
};
</script>

<template>
  <div class="optroot">
    <div @click="count++">count: {{ count}}, twoWay: {{twoWay}}</div>
    <button @click="twoWay+=3">Set two way</button>
    <button @click="increment">Increment me from a method</button>
    <button @click="specificIncrement">Increment me from an instance-specific method</button>
    <div v-html="html"></div>
    <input v-bind:placeholder="placeholder" :disabled="truthy" />
    <input :placeholder="placeholder" :disabled="falsy" />
    <input :placeholder="placeholder" :disabled="weird" />
    <input v-bind="complex" />
    <button @click="error">throw an error</button>
    <button @click="printThis">`this` is wrong in an arrow function</button>
    <button @click="printArrayPush">Array push method has been wrapped</button>
    <div>{{ (() => {return "I'm an IIFe!".replace(/e/, (x) => x.toUpperCase());})()}}</div>
    <div>{{ datafunc()}}</div>
    <div>The square root of 2 is {{ Math.sqrt(2)}}</div>
    <div>{{ customGlobal}}</div>
    <div @click="(toggly = !toggly)">Toggle me {{ toggly}}</div>
    <div v-on:click="toggly = !toggly">Non-shorthand toggly</div>
    <div v-if="toggly">I'm conditionally rendered</div>
    <div>Length of reactive array is {{ arr.length}}</div>
    <div>First element of reactive array is {{ arr[0]}}</div>
    <button @click="arrayPush">Array push</button>
    <button @click="sneakyArrayPush">Sneaky array push</button>
    <button @click="setArrayLength">Set array length</button>
    <button @click="arrayReverse">Reverse array</button>
    <div @click="whichevent = whichevent === 'keydown' ? 'keyup' : 'keydown'">Which event to trigger on?</div>
    <div>
      This input updates on {{ whichevent}}
      <input @[whichevent]="rand = Math.random()" />
      <input v-on:[whichevent]="rand = Math.random()" />
      <input v-on:[useless]="rand = Math.random()" placeholder="This one is useless" />
      <input v-on:[whichevent].prevent="rand = Math.random()" placeholder="This one uses a modifier" />
      <div>{{ rand}} squared is {{ iAmComputed}}</div>
    </div>
    <hr />
    <div>{{ dynamic}}</div>
    <hr />
    <p>Lifecycle hook demo</p>
    <LifecycleBoxOptions v-if="showLifecycleBox" :someprop="lifecycleBoxProp" />
    <button @click="updateProp">Update lifecycle box prop</button>
    <button @click="showLifecycleBox=!showLifecycleBox">Show/hide lifecycle box</button>
  </div>
</template>

<style scoped>
.optroot {
  border: 3px solid #e80;
}
</style>
