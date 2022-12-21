import {createApp} from 'vue'
import {createPinia} from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'

// const app = createApp(App)
const app = createApp({
  data() {
    return {
      count: 0,
      html: `<span style="font-weight: 700">Hello</span>`,
      placeholder: "Some text",
      truthy: true,
      falsy: null,
      weird: '',
      complex: {placeholder: "foo"},
      func: () => "Func",
      toggly: true,
      rand: 0.0,
      whichevent: "keydown",
      useless: null,
    };
  },

  watch: {
    count(...args) {
      console.log("Watch count", args);
    }
  }
});

app.use(createPinia())
app.use(router)
app.config.errorHandler = (err) => {
  console.log("App global error handler called");
  console.log(err);
};
app.config.globalProperties.customGlobal = "I'm a custom global!";

console.log("App mount");
console.log(app);
console.log(app.mount('#app'));
