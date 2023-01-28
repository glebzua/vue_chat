import ContactsService from '../services/contacts.service';

const user = JSON.parse(localStorage.getItem('loggedIn'));
const initialState = user
  ? { status: { getContacts: true }, user }
  : { status: { getContacts: false }, user: null };

export const contacts = {
  namespaced: true,
  state: initialState,
  actions: {
    GetContacts({ commit }, contacts) {
      return ContactsService.GetContacts(contacts).then(
          contacts => {
           try {if (contacts===null){

              contacts= [{
                "id": 0,
                  "userId": localStorage.getItem('userId'),
                  "contactId": 0,
                  "activated": false,
                  "chatId": "",
                  "nickname": "",
                  "createdDate": ""
              }
            ]
              // console.log(contacts)
              return Promise.resolve(contacts);
            }}catch (e) {
              return Promise.reject(e);
            }
          commit('GetContactsSuccess', contacts);
          return Promise.resolve(contacts);
        },
        error => {
          commit('GetContactsFailure');
          return Promise.reject(error);
        }
      );
    },

  },
  mutations: {
    GetContactsSuccess(state, contacts) {
      state.status.getContacts = true;
      state.contacts = contacts;
    },
    GetContactsFailure(state) {
      state.status.getContacts = false;
      state.contacts = null;
    },
  }
};
