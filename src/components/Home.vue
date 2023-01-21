<template>

  <div class="block-users">
    <th>Users</th>
    <tr
        v-for="(index) of users"
        id="app"
        :key="index"
    >
      <td >{{index.name}}
        <img
            v-if="(!contacts.some(data => data.contactId === index.id))"

            @click="clickUser(index.id,index.name)"

                    @mouseenter="mouseOverId(index.id)"
                    @mouseleave="mouseleaveId"

            src="../assets/request-send.png"
            width="25"

        >

      </td>
      <td v-if="inContacts(index.id)">{{ status }}</td>
     <td v-if="hover===index.id">{{ requestState }}</td>
    </tr>
  </div>



</template>

<script>


import AuthService from "@/services/auth.service";
import {users} from "@/store/users.module";
import {contacts} from "@/store/contacts.module";


export default {
  name: 'Home-page',
  props: {
    msg: String

  },
  data() {
    return {

      users:[],
      nickname:null,
      errors:[],
      clickedUser:null,
      hover: false,
      requestState:'send chat request',
      contacts:[],
      status:null,

    }
  },
  mounted(){
    AuthService.tokenExpireCheck()
    this.getUsers()
    this.getContacts()

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

    inContacts(id){
       try{
        if(this.contacts.length===0){
          this.contacts.contactId=0
            this.status="You dont add any  user to contacts"
            return this.status
          }

             if(this.contacts.length!=0){
              if(this.contacts.find(data => data.contactId ===id)){
                this.status="this  contact already in contacts list"
                return this.status
              }
      }
      }catch
                    (error)
      {
        console.log("inContacts catch Error: ", error);
      }
      return false
    },
    getContacts(event) {
       this.$store.dispatch("contacts/GetContacts", event).then(
          () =>
              this.contacts=contacts.state.contacts,
           this.$store.state.contacts.contacts=this.contacts  ,
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

    async clickUser(userId,userName) {
      try {
        console.log("this.clickedUser,this.nickname =",{

        });
        await this.$store.dispatch("messages/SendRequest", {
          userId:userId
          ,nickname:userName})
            .then(response=>{
              this.requestState = response,
                  console.log("this.requestState =",this.requestState),
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
<style >

</style>
