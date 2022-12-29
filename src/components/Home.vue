<template>
  <div
      v-if="loggedIn"
      class="navbar-nav ml-auto"
  >
    <span>loggedIn </span>
  </div>
  <div
      v-if="!loggedIn"
      class="navbar-nav ml-auto"
  >
    <span>  please login </span>
  </div>
  <div class="block-users">
    <th>Users</th>
    <tr
        v-for="(index) of users"
        id="app"
        :key="index"
    >
      <td >{{index.name}}
        <img
            @click="clickUser(index.id)"
            @mouseenter="mouseOverId(index.id)"
            @mouseleave="mouseleaveId"
            src="../assets/request-send.png"
            width="25"
      >
      </td>
        <td v-if="hover===index.id">{{ requestState }}</td>

      <!--            @mouseleave="hover = false"-->
    </tr>
  </div>
</template>

<script>


import AuthService from "@/services/auth.service";
import {users} from "@/store/users.module";


export default {
  name: 'Home-page',
  props: {
    msg: String

  },
  data() {
  return {
    users:[],
    errors:[],
    clickedUser:null,
    hover: false,
    requestState:'send chat request'

  }
},
  mounted(){
    AuthService.tokenExpireCheck()
    this.getUsers()
  },
computed: {
    loggedIn() {
      try {
        if (localStorage.loggedIn === 'true') {
          return true
        }
      } catch (e) {
        localStorage.setItem('$store.loggedIn', 'false');
      }
      return false;
    },
  },
    methods: {
      logOut() {
        this.$store.dispatch('auth/logout');
        this.$router.push('/login');


      },
      mouseOverId(userId){
        this.hover=userId
      },
      mouseleaveId(){
        this.requestState='send chat request'
      },
      getUsers(event) {
        // console.log(" getUsers(event)")
        this.$store.dispatch("users/GetUsers", event).then(
            () =>
                this.users=users.state.users,
            (error) => {
              this.loading = false;
              this.message =
                  (error.response &&
                      error.response.data &&
                      error.response.data.message) ||
                  error.message ||
                  error.toString();
            }
        );
      },

      async clickUser(userId) {
        try {

          this.clickedUser = userId
          await this.$store.dispatch("messages/SendRequest", this.clickedUser)
           .then(response=>{
                  this.requestState = response,
                 (error) => {
                this.message =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
              }}
          );
        }catch
        (error)
        {
          console.log("catch Error: ", error);

        }
      }

}}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >

</style>
