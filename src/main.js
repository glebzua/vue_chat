import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";


import './interceptors/axios'

createApp(App)
    .use(router)
    .use(store)
    .mount("#app");
// createApp(App)
//     .use(router)
//     .use(store)
//     .mount("#app-2");
