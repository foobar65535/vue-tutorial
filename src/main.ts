import {createApp} from 'vue'
import {createPinia} from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'

// const app = createApp(App)
const app = createApp(App);

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
