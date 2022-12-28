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
        return MessagesService.GetMessages(chatId).then(
          messages => {
          commit('GetMessagesSuccess', messages);
          return Promise.resolve(messages);
        },
        error => {
          commit('GetMessagesFailure');
          return Promise.reject(error);
        }
      );
    },
    SendMessage({ commit }, sendMessage) {
        return MessagesService.SendMessage(sendMessage).then(
          messages => {
            commit('SendMessageSuccess', messages);
              return Promise.resolve(messages);
          },
          error => {
            commit('SendMessageFailure');
            return Promise.reject(error);
          }
      );
    },
    SendRequest({ commit }, sendRequest) {
      return MessagesService.SendRequest(sendRequest).then(
          messages => {
            commit('SendRequestSuccess', messages);
            return Promise.resolve(messages);
          },
          error => {
            commit('SendRequestFailure');
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
    SendMessageSuccess(state, message) {
      state.status.sendMessage = true;
      state.message = message;
    },
    SendMessageFailure(state) {
      state.status.sendMessage = false;
      state.message = null;
    },
    SendRequestSuccess(state, message) {
      state.status.sendRequest = true;
      state.message = message;
    },
    SendRequestFailure(state) {
      state.status.sendRequest = false;
      state.message = null;
    },
  }
};
