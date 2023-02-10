import { createStore } from "vuex";
import { auth } from "./auth.module";
import { contacts } from "./contacts.module";
import {getMessages, hadNewMessages, messages, openImage,sendImage} from "./messages.module";
import { users } from "./users.module";
const store = createStore({
  modules: {
    auth,
    contacts,
    messages,
    hadNewMessages,
    openImage,
    sendImage,
    getMessages,
    users,


  },
});

export default store;
