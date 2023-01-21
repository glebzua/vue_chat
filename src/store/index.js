import { createStore } from "vuex";
import { auth } from "./auth.module";
import { contacts } from "./contacts.module";
import {getMessages, hadNewMessages, messages} from "./messages.module";
import { users } from "./users.module";
const store = createStore({
  modules: {
    auth,
    contacts,
    messages,
    hadNewMessages,
    getMessages,
    users,


  },
});

export default store;
