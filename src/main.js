import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import PusherPlugin from './plugins/pusher'

import './interceptors/axios'
const apiKey ='9ed72d77970a15f0b3fe'
    // '7c091379f42605551f4b'
createApp(App)
    .use(router)
    .use(store)
    .use(PusherPlugin, { apiKey, cluster: 'eu' })
    .mount("#app");
