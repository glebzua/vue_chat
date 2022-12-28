import UsersService from '../services/users.service';

const user = JSON.parse(localStorage.getItem('loggedIn'));
const initialState = user
  ? { status: { getUsers: true }, user }
  : { status: { getUsers: false }, user: null };

export const users = {
  namespaced: true,
  state: initialState,
  actions: {
    GetUsers({ commit }, users) {
      return UsersService.GetUsers(users).then(
          users => {
          commit('GetUsersSuccess', users);
           // console.log('GetUsersSuccess', users)
          return Promise.resolve(users);
        },
        error => {
          commit('GetUsersFailure');
          return Promise.reject(error);
        }
      );
    },

  },
  mutations: {
    GetUsersSuccess(state, users) {
      state.status.getUsers = true;
      state.users = users;
    },
    GetUsersFailure(state) {
      state.status.getUsers = false;
      state.users = null;
    },
  }
};
