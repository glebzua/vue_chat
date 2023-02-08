import MessagesService from '../services/messages.service';

const user = JSON.parse(localStorage.getItem('loggedIn'));
const initialState = user
  ? { status: { getMessages: true }, user }
  : { status: { getMessages: false }, user: null };

export const messages = {
  namespaced: true,
  state: initialState,
  actions: {
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
export const hadNewMessages = {
  namespaced: true,
  state: initialState,
  actions: {
    HadNewMessages({commit}) {
      return MessagesService.HadNewMessages().then(
          hadNewMessages => {
            commit('HadNewMessagesSuccess', hadNewMessages);

            return Promise.resolve(hadNewMessages);
          },
          error => {
            commit('HadNewMessagesFailure');
            return Promise.reject(error);
          }
      );
    },

  },
  mutations: {
    HadNewMessagesSuccess(state, hadNewMessages) {
      state.status.hadNewMessages = true;
      state.hadNewMessages = hadNewMessages;
    },
    HadNewMessagesFailure(state) {
      state.status.hadNewMessages = false;
      state.hadNewMessages = null;
    },
  }
}

export const getMessages = {

  namespaced: true,
  state: initialState,
  actions: {
    GetMessages({commit} , chatId) {
      return MessagesService.GetMessages(chatId).then(
          getMessages => {
            if(length.getMessages>0){
            commit('GetMessagesSuccess', Object.keys(getMessages).map((key) => getMessages[key]))
            return Promise.resolve(getMessages);
            }
            commit('GetMessagesSuccess', getMessages);
            return Promise.resolve(getMessages);

          },
          error => {
            commit('GetMessagesFailure');
            return Promise.reject(error);
          }
      );
    },
},
  mutations: {
    GetMessagesSuccess(state, getMessages) {
      state.status.getMessages = true;
      state.getMessages = getMessages;
    },
    GetMessagesFailure(state) {
      state.status.getMessages = false;
      state.getMessages = null;
    },
  }}



export const openImage = {
  namespaced: true,
  state: initialState,
  actions: {
    OpenImage({ commit }, imageId) {
      return MessagesService.OpenImage(imageId).then(
          openImage => {
            commit('OpenImageSuccess', openImage);
            return Promise.resolve(openImage);
          },
          error => {
            commit('OpenImageFailure');
            return Promise.reject(error);
          }
      );
    },

  },
  mutations: {
    OpenImageSuccess(state, openImage) {
      state.status.openImage = true;
      state.openImage = openImage;
    },
    OpenImageFailure(state) {
      state.status.openImage = false;
      state.image = null;
    },

  }
};