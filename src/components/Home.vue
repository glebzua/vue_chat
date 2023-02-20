<template>
  <input type="search" placeholder="Search..." v-model="search" style="width: 100%">
  <div class="block-home-page">



  <div>
    <th class="block-users-home-page">Users</th>
    <tr class="block-users-home-page"
        v-for="(index) of filteredData"
        id="app"
        :key="index"
    >
      <td class="block-users"

          @mouseenter="mouseOverId(index.id,index.name)"

      >{{index.name}}


      </td>
      <td class="block-users-status" v-if="inContacts(index.id)">{{ status }}</td>

     <td class="block-yourself" v-if="hover===index.id">{{ requestState }}</td>

      <td class="block-transition"><transition   v-if="enableTransition(index.id)"
                 >
        <input class="block-transition-nickname"
               maxlength="50"
               v-model="textMessage" :placeholder=nickname
              >
      </transition>
      <transition v-if="enableTransition(index.id)"
      >
        <button   class="block-transition-submit" @click="sendRequest()">{{ submitButton }}</button>
      </transition>
      </td>
    </tr>
  </div>

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
      submitButton:"Submit",
      textMessage:"",
      loading: false,
      users:[],
      nickname:"",
      errors:[],
      hover: false,
      requestState:'',
      contacts:[],
      status:null,
      search:'',

    }
  },



  mounted(){
    AuthService.tokenExpireCheck()
    this.getUsers()
    this.getContacts()

  },
  computed: {
    filteredData() {
      return this.users
          .filter(
              (entry) => this.users.length
                  ? Object.keys(this.users[0])
                      .some(key => ('' + entry[key]).toLowerCase().includes(this.search))
                  : true
          );
    },

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
    enableTransition(id){
      try{
        if(id!==this.hover||id===parseInt(localStorage.getItem('userId'))){

          return false
        }
        if(this.contacts.length!==0){
        if(this.contacts.find(data => data.contactId ===id)){
          return false
        }
      }

      }catch
          (error)
      {
        console.log("inContacts catch Error: ", error);
      }
      return true
    },


    getContacts(event) {
       this.$store.dispatch("contacts/GetContacts", event).then(
          () =>
              this.contacts=contacts.state.contacts,
              this.$store.state.contacts.contacts=this.contacts,
          (error) => {
console.log(" home page    (error) =>")
            // this.loading = false;
            this.message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
          }
      );
    },
    inContacts(id){

      try{
          if(this.contacts.length!==0){
          if(this.contacts.find(data => data.contactId ===id)
          ){
            this.status="this contact already in contacts list"
            return true
          }
            // this.contacts.find((element) => {
            //   if(element.contactId===id){
            //   this.status="this contact already in contacts list by nickname "+element.nickname
            //     return true
            //   }})
        }
      }catch
          (error)
      {
        console.log("inContacts catch Error: ", error);
      }
      return false
    },
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');


    },
    mouseOverId(userId,userName){

       if(userId===parseInt(localStorage.getItem('userId'))){
       this.requestState='this is You'
       this.hover=userId
        return
      }
      this.requestState=''
      this.hover=userId
      this.nickname=userName
      this.textMessage=userName
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

    sendRequest() {
      if(this.requestState==='this is You'){
        return
      }
      this.loading = true;
        this.$store.dispatch("messages/SendRequest", {
          userId:this.hover
          ,nickname:this.textMessage})
            .then(response=>{
              this.submitButton= response,
                  setTimeout(() => {
                    this.getContacts();
                    this.submitButton="Submit"
                  }, 600),
                  (error) => {
                    this.loading = false;
                    this.message =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
                  }}
            );
    }
  }}
</script>
<style scoped>
.block-home-page{width:100%;overflow:auto;float:left}
.block-users{width:35%;overflow:auto;float:left;font-size:1em;}
.block-users-status{width:35%;overflow:auto;float:left}
.block-yourself{width:40%;overflow:auto;float:left;}
.block-transition{width:50%;float:left}
.block-users-home-page{width:100%;height:15%;overflow:auto;float:left;font-size:1em;}

.block-transition-nickname{width:40%;overflow:auto;font-size:0.8em;padding:0;border-width: 1px}
.block-transition-submit{width:20%;overflow:auto;font-size:0.8em;padding:0;border-width: 1px;}
</style>
