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
<!--      <td @load="inContacts(index.id)">{{index.id}}||{{status}}</td>-->
<!--      <td v-if="(!contacts.some(data => data.contactId === index.id))"> contactId===2 |  </td>-->

<!--      <td v-if="(this.contacts.some(data => data.contactId == '2'))"> {{index.id}} |  </td>-->
      <td v-if="hover===index.id">{{ requestState }}</td>

      <!--            @mouseleave="hover = false"-->
    </tr>
  </div>

<!--  <span>-->
<!--    contacts-->
<!-- {{ contacts }}-->
<!--</span>-->
<!--<p>__</p>-->
<!--  <span>-->
<!--users-->

<!-- {{ users }}-->
<!--</span>-->

  <!--  <h2 v-if="!filter('1')">No match</h2>-->
  <!--  <h2 v-if="!filter('11')">No match</h2>-->
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
      // haveInChatListArr:[],
      users:[],
      nickname:null,
      errors:[],
      clickedUser:null,
      hover: false,
      requestState:'send chat request',
      contacts:[],
      status:null,
      tempVal:0,

    }
  },
  mounted(){
    AuthService.tokenExpireCheck()
    this.getUsers()
    this.getContacts()
    // this.inContacts()

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
           console.log("inContacts .contacts.length",this.contacts.length)
      try{ console.log("inContacts .contacts.length",this.contacts.length)
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
      // this.tempVal+=1
      //     console.log("getContacts.tempVal=",this.tempVal)
      this.$store.dispatch("contacts/GetContacts", event).then(
          () =>
              this.contacts=contacts.state.contacts,
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
      // this.tempVal+=1
      // console.log("mouseOverId.tempVal=",this.tempVal)
    },
    mouseleaveId(){
      // this.tempVal+=1
      // console.log("mouseleaveId.tempVal=",this.tempVal)
      this.requestState='send chat request'
    },
    getUsers(event) {
      // this.tempVal+=1
      // console.log("getUsers.tempVal=",this.tempVal)
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

    async clickUser(userId,userName) {
      // this.tempVal+=1
      // console.log("clickUser.tempVal=",this.tempVal)
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >

</style>
