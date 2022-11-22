<template>

  <table>
    <tr>
      <th>Contact</th>
      <th>Messages</th>
<!--      <td>{{ contacts }}</td>-->
       </tr>





    <tr
        v-for="(index) of contacts"
        id="app"
        :key="index"
    >
      <td @click="mouseOverContactId([index.chatId])" >

        {{index.contactId}}</td>
      <td v-if="clickedChat==index.chatId">

        <span >clickedChat==index.contactId {{index.length}}</span>
        <p v-for="(index) of messages"
           id="app"
           :key="index" >
          {{index.message}}
        </p>
      </td>
    </tr>


<!--    <td v-for="(index) of messages"-->
<!--        id="app"-->
<!--        :key="index">  {{index.senderId}} "|" {{index.recipientId}}"|" {{index.message}} </td>-->
    <tr v-if="errors && errors.lenght">
      <td
          v-for="(index, error) of errors"
          :key="index"
      >
        {{ error.message }}
      </td>
    </tr>

  </table>
</template>

<script>

// import axios from "axios";
import AuthService from "@/services/auth.service";
import {contacts} from "@/store/contacts.module";
import {messages} from "@/store/messages.module";
// import axios from 'axios'
export default {
  name: "contacts-page",

  data() {
    return {
      contacts:[],
      errors:[],
      clickedChat:null,
      messages:[],

    }

  },
  mounted(){
    AuthService.tokenExpireCheck()
    this.getContacts()
    // this.mouseOverContactId()

  },
  methods:{


    getContacts(event) {
      // this.loading = true;
      this.$store.dispatch("contacts/GetContacts", event).then(
          () =>

          // {setTimeout(() => (this.loading = false), 800);},
          // console.log("getContacts(event)",contacts.state.contacts),
          this.contacts=contacts.state.contacts,
          // {
          // this.$router.push("/Home");
          // },``
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
    mouseOverContactId(event)
    {
 console.log("event=",event)
//       this.loading = true;
      this.$store.dispatch("messages/GetMessages", event).then(
          () =>

          // {setTimeout(() => (this.loading = false), 800);},
          // console.log("getMessages(event)",messages.state.messages),
          this.messages=messages.state.messages,
          // console.log("clickedChat=messages",this.messages),
          this.clickedChat=event,
          //
          // console.log("clickedChat=event",this.clickedChat),


          // {
          // this.$router.push("/Home");
          // },``
          (error) => {
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
  },
}
</script>

<style scoped>

</style>