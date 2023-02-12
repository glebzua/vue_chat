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
      <td class="block-request-img" >
        <p>
        <img
            v-if="(!contacts.some(data => data.contactId === index.id))"
            @click="clickUser(index.id,index.name)"
            @mouseenter="mouseOverId(index.id)"
            @mouseleave="mouseLeaveId"
            src="../assets/request-send.png"
            width="25"
        >
          </p>
      </td>
      <td class="block-users">{{index.name}}


      </td>
      <td class="block-users-status" v-if="inContacts(index.id)">{{ status }}</td>
     <td class="block-users-request" v-if="hover===index.id">{{ requestState }}</td>
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

      loading: false,
      users:[],
      nickname:null,
      errors:[],
      clickedUser:null,
      hover: false,
      requestState:'send chat request',
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
      try{if(this.contacts.length!=0){
          if(this.contacts.find(data => data.contactId ===id)){
            this.status="this contact already in contacts list"
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
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');


    },
    mouseOverId(userId){
       if(userId===parseInt(localStorage.getItem('userId'))){
        this.requestState='this is You'
       this.hover=userId
        return
      }
      this.hover=userId
      this.requestState='send chat request'
     },
    mouseLeaveId(){
      this.hover=false
         this.requestState=''

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

    clickUser(userId,userName) {
      if(this.requestState==='this is You'){
        return
      }
      this.loading = true;
        this.$store.dispatch("messages/SendRequest", {
          userId:userId
          ,nickname:userName})
            .then(response=>{
              this.requestState = response,
                  // console.log("this.requestState =",this.requestState),
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
.block-home-page{width:100%;height:90%;overflow:auto;float:left}
.block-request-img{width:5%;height:85%;overflow:auto;float:left}
.block-users{width:35%;height:70%;overflow:auto;float:left}
.block-users-status{width:35%;height:70%;overflow:auto;float:left}
.block-users-request{width:40%;height:70%;overflow:auto;float:left;}
.block-users-home-page{width:100%;height:10%;overflow:auto;float:left}


</style>
