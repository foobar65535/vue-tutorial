<script lang="ts">
import {reactive, computed, ref} from 'vue';
export default {
  setup() {
    const mutable = reactive({count: 0});
    const doesNotDependOnSetup = computed(() => mutable.count ** 2);
    const tagName = ref('<none>');
    const clickMsg = ref('<initial>');
    const keyText = ref('<initial>');
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
    return {
      mutable,
      doesNotDependOnSetup,
      nested,
      tagName,
      clickMsg,
      causeLag,
      keyText,
      addOutside(ev: MouseEvent) {
        console.log("Add outside event", ev);
        mutable.count += 3;
      },
      addOutsideN(n: number) {
        mutable.count += n;
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
</style>
