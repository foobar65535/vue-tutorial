<script lang="ts">
import {reactive, computed, ref, nextTick} from 'vue';

import CustomInput from './CustomInput.vue';

export default {
  components: {
    CustomInput,
  },
  setup() {
    const mutable = reactive({count: 0});
    const doesNotDependOnSetup = computed(() => mutable.count ** 2);
    const tagName = ref('<none>');
    const clickMsg = ref('<initial>');
    const keyText = ref('<initial>');

    const manuallyBoundInput = ref('This is a manually bound input');
    const autoBoundInput = ref('This is a automatically bound input');
    const autoBoundCheckbox = ref(false);

    const nested = {
      a: {
        b: {
          fn: (ev: MouseEvent, ...extraArgs: string[]) => {
            mutable.count--;
            tagName.value = `${ev.target.tagName} with extra args ${extraArgs.join(', ')}`;
          }
        }
      }
    };
    const causeLag = () => {
      let str = '';
      for (let i = 0; i < 2e6; i++) {
        str += String(Math.random()).slice(0, 3);
      }
      console.log("Huge amounts of lag", str.slice(3333332, 3333334));
    };
    const selectComputedInner = ref([]);
    const selectComputed = computed<string[]>({
      get() {
        return selectComputedInner.value;
      },
      set(val) {
        selectComputedInner.value = [];
      },
    });
    const weirdCheck = ref('default');
    const weirdCheckTrue = ref(weirdCheck.value);
    const weirdCheckFalse = ref('other');
    const toggleWeirdCheck = () => {
      const trueValue = Math.random().toString(36);
      const falseValue = Math.random().toString(36).toUpperCase();
      const nextValue = weirdCheck.value === weirdCheckTrue.value ? falseValue : trueValue;
      weirdCheckTrue.value = trueValue;
      weirdCheckFalse.value = falseValue;
      // You need this nextTick for this to work
      nextTick(() => {
        weirdCheck.value = nextValue;
      });
    };
    return {
      mutable,
      doesNotDependOnSetup,
      nested,
      tagName,
      clickMsg,
      causeLag,
      keyText,
      manuallyBoundInput,
      autoBoundInput,
      autoBoundCheckbox,
      selectArr: ref([]),
      selectSet: ref(new Set()),
      radio: ref('alpha'),
      select: ref('Hydrogen'),
      listOfItems: ['Hydrogen', 'Lithium', 'Sodium', 'Potassium'],
      checkedArr: ref([]),
      checkedSet: ref(new Set()),
      radioOther: ref('other'),
      selectComputedInner,
      selectComputed,
      stringCheck: ref('default'),
      weirdCheck,
      weirdCheckTrue,
      weirdCheckFalse,
      toggleWeirdCheck,
      customInput: ref('this is a custom input'),
      weirdRadio: ref('<default>'),
      weirdRadioChoices: reactive(['first', 'second', 'third']),
      selectObj: ref({'default': 'yes'}),
      lazyText: ref('i am lazy'),
      numberInput: ref(33333),
      trimmedInput: ref('     i start out not trimmed         '),
      addOutside(ev: MouseEvent) {
        console.log("Add outside event", ev);
        mutable.count += 3;
      },
      addOutsideN(n: number) {
        mutable.count += n;
      },
      logSelectChange(ev: any) {
        console.log("Select change", ev);
      },
    };
  }
};
</script>

<template>
  <div class="comproot">
    <div @click="mutable.count++">{{ mutable.count}} squared is {{ doesNotDependOnSetup}} (does not depend on setup)
    </div>
    <div @click="mutable.count++">Tag name is {{ tagName}}</div>
    <button @click="addOutside">Add outside 1</button>
    <button @click="addOutsideN(5)">Add outside 2</button>
    <button @click="nested.a.b.fn">Subtract with nested event handler</button>
    <button @click="nested.a.b.fn($event, 'magic')">Subtract with explicit event passing using magic variable</button>
    <button @click="nested.a.b.fn($event, $event.target.tagName)">And with extra tag name</button>
    <button @click="(ev) => nested.a.b.fn(ev, 'explicit', 'arrow')">Subtract with explicit event passing using arrow
      fn</button>
    <button @click="nonexistent.handler">Nonexistent handler</button>
    <hr />
    <div>Click message is: {{ clickMsg}}</div>
    <button @click="clickMsg = 'reset'">Reset click message</button>
    <div class="flexbox">
      <div class="bigpadding-foo" @click="clickMsg += '+outer1'">
        <div class="bigpadding-bar" @click="clickMsg += '+inner1a'">
          Click me inner
        </div>
        <div class="bigpadding-bar" @click.stop="clickMsg += '+inner1b'">
          Click me inner with stopPropagation
        </div>
        And outer
      </div>
      <div class="bigpadding-foo" @click.self="clickMsg += '+outer2'">
        <div class="bigpadding-bar" @click="clickMsg += '+inner2a'">
          Click me inner with NO stopPropagation
        </div>
        <div class="bigpadding-baz">
          No event handler
        </div>
        And outer with self
      </div>
      <div class="bigpadding-foo" @click.capture="clickMsg += '+outer3'">
        <div class="bigpadding-bar" @click.capture="clickMsg += '+inner3a'">
          Nested capture
          <div class="bigpadding-foo" @click="clickMsg += '+Inner3a1'">
            Click me inner
          </div>
        </div>
        Capture
      </div>
      <div class="bigpadding-foo" @click.capture.self="clickMsg += '+outer4'">
        <div class="bigpadding-bar" @click="clickMsg += '+Inner4a'">
          Click me inner
        </div>
        <div class="bigpadding-baz">
          No event handler
        </div>
        Both capture and self? (self seems to override capture)
      </div>
      <div class="bigpadding-bar" @click.once="clickMsg += '+Inner5'">
        Single use click me
      </div>
      <div class="bigpadding-foo" @click="clickMsg += '+outer6'">
        <div class="bigpadding-bar" @click.once.stop="clickMsg += '+Inner6a'">
          Single use click me inner with stopPropagation only stops propagation once
        </div>
        Outer
      </div>
    </div>
    <hr />
    <div class="scrolly" @scroll="causeLag">
      <p v-for="i in 30">This is the {{ i}}th line of scrollable text and this div has a janky scroll handler</p>
    </div>
    <div class="scrolly" @scroll.passive="causeLag">
      <p v-for="i in 30">This is the {{ i}}th line of scrollable text and this div has a janky scroll handler but is
        passive</p>
    </div>
    <div class="scrolly" @scroll.passive.prevent="causeLag">
      <p v-for="i in 30">This is the {{ i}}th line of scrollable text and this div has a janky scroll handler but is
        passive AND prevent</p>
    </div>
    <div>Key text: {{ keyText}}</div>
    <p>Second textbox supports enter; tab; delete/backspace; esc; space; up, down, left, right; Q!!!!!; Ctrl-B;
      Ctrl-G(exact); Shift-G(exact); Alt-G(exact); Meta-G(exact)(doesn't workon my system)</p>
    <input @keyup="keyText = 'up' + Date.now()" placeholder="basic" />
    <input @keydown.enter.prevent="keyText = 'down.enter' + Date.now()"
      @keydown.tab.prevent="keyText = 'down.tab' + Date.now()" @keydown.delete="keyText = 'down.delete' + Date.now()"
      @keydown.esc="keyText = 'down.esc' + Date.now()" @keydown.space="keyText = 'down.space' + Date.now()"
      @keydown.up="keyText = 'down.up' + Date.now()" @keydown.down="keyText = 'down.down' + Date.now()"
      @keydown.left="keyText = 'down.left' + Date.now()" @keydown.right="keyText = 'down.right' + Date.now()"
      @keydown.q="keyText = 'down.QQQQQ' + Date.now()" @keydown.ctrl.b.prevent="keyText = 'down.CtrlB' + Date.now()"
      @keydown.ctrl.g.exact.prevent="keyText = 'down.CtrlG(exact)' + Date.now()"
      @keydown.shift.g.exact.prevent="keyText = 'down.ShiftG(exact)' + Date.now()"
      @keydown.alt.g.exact.prevent="keyText = 'down.AltG(exact)' + Date.now()"
      @keydown.meta.g.exact.prevent="keyText = 'down.MetaG(exact)' + Date.now()" placeholder="" />
    <p>Modifier keyup is special: (ctrl) (triggers when a non-modifier key is released when the modifier key is held)
      (but on my machine it also triggers when the modifier key is released on its own, which is DIFFERENT FROM THE
      DOCS!!! (but when there is another key in the "event specifier" the docs are right, the only way to trigger is to
      release the other key with ctrl pressed) (Uh no THE DOCS ARE STILL WRONG the event triggers when CTRL is released
      when the other key is pressed, too)</p>
    <input @keyup.ctrl="keyText = 'up.ctrl' + Date.now()" placeholder="Ctrl KeyUp" />
    <input @keyup.ctrl="keyText = 'up.ctrl' + Date.now()" placeholder="Ctrl-A KeyUp" />
    <button @click.ctrl="keyText = 'click.ctrl' + Date.now()">Ctrl-click this button</button>
    <button @click.left="keyText = 'click.left' + Date.now()" @click.middle="keyText = 'click.middle' + Date.now()"
      @click.right.prevent="keyText = 'click.right' + Date.now()">Left/Middle/Right-click this button</button>
    <button @click.middle.ctrl="keyText = 'click.middle.ctrl' + Date.now()">Ctrl-middle-click this button</button>
    <hr />

    <div>The value of the below input is manually bound: {{ manuallyBoundInput}}</div>
    <input :value="manuallyBoundInput" @input="manuallyBoundInput = $event.target.value" /> is equal to
    <input :value="manuallyBoundInput" @input="manuallyBoundInput = $event.target.value" />
    <div>The value of the below input is bound using v-model (using value property and input event): {{ autoBoundInput}}
    </div>
    <div>Magically the bound value is not updated during IME composition. How?</div>
    <input v-model="autoBoundInput" /> is equal to
    <input v-model="autoBoundInput" />
    <textarea v-model="autoBoundInput"></textarea>
    <div>The value of the below input is bound using v-model (using checked property and change event): {{
        autoBoundCheckbox
    }}</div>
    <input type="checkbox" v-model="autoBoundCheckbox" /> is equal to
    <input type="checkbox" v-model="autoBoundCheckbox" />
    <div>Radio button state: {{ radio}}</div>
    <form>
      Foo <input type="radio" name="foo" value="alpha" v-model="radio" /> and Bar
      <input type="radio" name="foo" value="beta" v-model="radio" />
    </form>
    <div>Dropdown state: {{ select}}</div>
    <select v-model="select">
      <option v-for="item in listOfItems" :value="item">{{ item}}</option>
    </select>
    <div>Every other item is disabled</div>
    <select v-model="select">
      <option value="" disabled>Dummy</option>
      <option v-for="(item, i) in listOfItems" :value="item" :disabled="i % 2 === 0">{{ item}}</option>
    </select>
    <p>These checkboxes are an array</p>
    <div>
      <span v-for="item in listOfItems">
        <input type="checkbox" :value="item" v-model="checkedArr" />
        {{ item}}
      </span>
    </div>
    and
    <div>
      <span v-for="item in listOfItems">
        <input type="checkbox" :value="item" v-model="checkedArr" />
        {{ item}}
      </span>
    </div>
    <hr />
    <p>These checkboxes are a set</p>
    <div>
      <span v-for="item in listOfItems">
        <input type="checkbox" :value="item" v-model="checkedSet" />
        {{ item}}
      </span>
    </div>
    and
    <div>
      <span v-for="item in listOfItems">
        <input type="checkbox" :value="item" v-model="checkedSet" />
        {{ item}}
      </span>
    </div>
    <hr />
    <p>Chosen radio button is {{ radioOther}}</p>
    <div>
      <span v-for="item in listOfItems">
        <input type="radio" :value="item" v-model="radioOther" />
        {{ item}}
      </span>
    </div>
    and
    <div>
      <span v-for="item in listOfItems">
        <input type="radio" :value="item" v-model="radioOther" />
        {{ item}}
      </span>
    </div>
    <hr />
    <div>What you can directly serialize an array?: {{ listOfItems}}</div>
    <p>Multiple select</p>
    <div>
      array
      <select class="ib" v-model="selectArr" multiple>
        <option v-for="(item, i) in listOfItems" :value="item">{{ item}}</option>
      </select>
      <select class="ib" v-model="selectArr" multiple>
        <option v-for="(item, i) in listOfItems" :value="item" :disabled="i % 2 === 0">{{ item}}</option>
      </select>
      and set
      <select class="ib" v-model="selectSet" multiple>
        <option v-for="(item, i) in listOfItems" :value="item">{{ item}}</option>
      </select>
      <select class="ib" v-model="selectSet" multiple>
        <option v-for="(item, i) in listOfItems" :value="item" :disabled="i % 2 === 0">{{ item}}</option>
      </select>
      and weird
      <select class="ib" v-model="selectComputedInner" multiple>
        <option v-for="(item, i) in listOfItems" :value="item">{{ item}}</option>
      </select>
      <select class="ib" v-model="selectComputed" multiple>
        <option v-for="(item, i) in listOfItems" :value="item" :disabled="i % 2 === 0">{{ item}}</option>
      </select>
    </div>
    <hr />
    <p>Checkbox value is {{ stringCheck}}</p>
    <input type="checkbox" v-model="stringCheck" true-value="checked" false-value="not checked" />
    <button @click="stringCheck = stringCheck === 'checked' ? 'not checked' : 'checked'">Externally toggle
      checkbox</button>
    <p>Weird checkbox value is {{ weirdCheck}} (true is {{ weirdCheckTrue}}, false is {{ weirdCheckFalse}})</p>
    <input type="checkbox" v-model="weirdCheck" :true-value="weirdCheckTrue" :false-value="weirdCheckFalse" />
    <button @click="toggleWeirdCheck">Externally toggle weird checkbox</button>
    <p>Weird radio choice is {{weirdRadio}} with choices {{weirdRadioChoices}} (without name attribute)</p>
    <template v-for="c in weirdRadioChoices">
      <input type="radio" :value="c" v-model="weirdRadio" /> is {{c}};
    </template>
    <p>Weird radio choice with name attribute</p>
    <template v-for="c in weirdRadioChoices">
      <input type="radio" :value="c" v-model="weirdRadio" name="weirdRadioNamedFoo" /> is {{c}};
    </template>
    <button @click="weirdRadioChoices.unshift(weirdRadioChoices.pop()!)">Rotate</button>
    <p>Wow typescript is compiled even in templates?</p>
    <p>Weird radio choice keyed and with name attribute</p>
    <template v-for="c in weirdRadioChoices" :key="c">
      <input type="radio" :value="c" v-model="weirdRadio" name="weirdRadioNamedBar" /> is {{c}};
    </template>
    <p>Select with object values {{selectObj}}</p>
    <select v-model="selectObj">
      <option v-for="i in 4" :value="{[Math.cos(i)]: Math.tan(i).toString(32)}">{{i}}</option>
    </select>
    <p>This select contains cyclic object values; rendering the value throws an error and destroys this component</p>
    <select v-model="selectObj">
      <option v-for="i in 4" :value="((a)=>(a.a=a,a))({})">{{i}}</option>
    </select>
    <p>This textbox is lazy and is updated on "change", not "input": {{lazyText}}</p>
    <input v-model.lazy="lazyText" />
    <p>This textbox takes numbers: {{numberInput}}, let's see typeof: {{typeof numberInput}}, it gives up if parseFloat can't handle the number (and you can't explicitly make it result in nan?).</p>
    <input v-model.number="numberInput" />
    <p>This textbox is lazy and numeric and tied with the previous one</p>
    <input v-model.number.lazy="numberInput" />
    <p>This textbox is implicitly numeric (note that the value property on the dom object is still a string, but it's an empty string if the input isn't a valid number)</p>
    <input type="number" v-model="numberInput" />
    <p> The below inputs are trimmed (after you change the input and unfocus it auto-trims)</p>
    <input v-model.trim="trimmedInput" /> and
    <input v-model.trim="trimmedInput" />
    <hr />
    <p>Value of custom input: {{customInput}} (can't just slap .lazy on custom inputs)</p>
    <CustomInput v-model="customInput" />
    <p>You can also use kebab case</p>
    <custom-input v-model="customInput" />
  </div>
</template>

<style scoped>
.comproot {
  border: 3px solid #080;
}

.flexbox {
  display: flex;
  flex-wrap: wrap;
}

.bigpadding-foo {
  padding: 8px;
  margin: 8px;
  background-color: #faa;
}

.bigpadding-bar {
  padding: 8px;
  margin: 8px 0;
  background-color: #afa;
}

.bigpadding-baz {
  padding: 8px;
  margin: 8px 0;
  background-color: #aaa;
}

.scrolly {
  height: 6em;
  overflow-y: auto;
  margin: 2px;
  border: 2px solid #f70;
}

.ib {
  display: inline-block;
}
</style>
