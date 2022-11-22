import MessagesService from '../services/messages.service';

const user = JSON.parse(localStorage.getItem('loggedIn'));
const initialState = user
  ? { status: { getMessages: true }, user }
  : { status: { getMessages: false }, user: null };

export const messages = {
  namespaced: true,
  state: initialState,
  actions: {
    GetMessages({ commit }, chatId) {
      // console.log("GetMessages messages",chatId)
      return MessagesService.GetMessages(chatId).then(
          messages => {
          commit('GetMessagesSuccess', messages);
          // console.log('GetMessagesSuccess', messages)
          return Promise.resolve(messages);
        },
        error => {
          commit('GetMessagesFailure');
          return Promise.reject(error);
        }
      );
    },

  },
  mutations: {
    GetMessagesSuccess(state, messages) {
      state.status.getMessages = true;
      state.messages = messages;
    },
    GetMessagesFailure(state) {
      state.status.getMessages = false;
      state.messages = null;
    },
  }
};
