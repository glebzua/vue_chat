import { createWebHistory, createRouter } from "vue-router";
import Home from "./components/Home.vue";

import Login from "./components/Login.vue";
import Chat from "./components/chat.vue";



const routes = [

  {
    path: "/",
    name: "Home-page",
    component: Home,
  },
  {
    path: "/chat",
    name: "Chat-page",
    component: Chat,
  },

  {
    path: "/login",
    component: Login,
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});



export default router;