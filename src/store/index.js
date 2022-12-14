import { createStore } from "vuex";
import { auth } from "./auth.module";
import { contacts } from "./contacts.module";
import { messages } from "./messages.module";
import { users } from "./users.module";
const store = createStore({
  modules: {
    auth,
    contacts,
    messages,
    users,


  },
});

export default store;
