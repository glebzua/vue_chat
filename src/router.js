import { createWebHistory, createRouter } from "vue-router";
import Home from "./components/Home.vue";

import Login from "./components/Login.vue";
import Contacts from "./components/contacts.vue";
import Chat from "./components/chat.vue";

const routes = [

  {
    path: "/",
    name: "Home-page",
    component: Home,
  },
  {
    path: "/myContacts",
    name: "Contacts-page",
    component: Contacts,
  },

  {

    name: "chat-page",
    component: Chat,
  },

  {
    path: "/login",
    component: Login,
  },
  // {
  //   path: "/register",
  //   component: Register,
  // },



];

const router = createRouter({
  history: createWebHistory(),
  routes,
});



export default router;