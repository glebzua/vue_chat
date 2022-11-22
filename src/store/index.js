import { createStore } from "vuex";
import { auth } from "./auth.module";
import { contacts } from "./contacts.module";
import { messages } from "./messages.module";
const store = createStore({
  modules: {
    auth,
    contacts,
    messages,


  },
});

export default store;
