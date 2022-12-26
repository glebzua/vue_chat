<template>
  <div class="block-contacts">
    <th>Contact</th>
    <tr
        v-for="(index) of contacts"
        id="app"
        :key="index"
    >
      <td @click="mouseOverContactId(index.chatId,index.contactId)" >
        {{index.contactId}}</td>
      <td v-if="clickedChat===index.chatId">
      </td>
    </tr>
  </div>
  <div class="block-messages">  <th>Messages</th>
    <table v-for="(index) of messages"
           :key="index">

      <td class="message-date"> {{index.createdDate}}</td>-->
      <td class="message-owner" v-if="messageRecipient===index.senderId" style="color: blue; text-align: left"> {{index.message}}</td>
      <td class="message-recipient" v-if="messageRecipient===index.recipientId" style="color: cornflowerblue ; text-align: right">{{index.message}}</td>
      <td class="message-receive-status">{{index.received}}</td>
      <td class="message-send-status">{{index.sended}}</td>
    </table>

  </div>
  <div class="block-message">
    <span>Message to {{messageRecipient}}:</span>
    <input v-model="textMessage" placeholder="text here" />
  </div>
  <div class="block-send-button">
    <span @click="SendMessage(clickedChat,messageRecipient,textMessage)" > button here </span>
  </div>

  <tr v-if="errors && errors.lenght">
    <td
        v-for="(index, error) of errors"
        :key="index"
    >
      {{ error.message }}
    </td>
  </tr>

</template>

<script>
import AuthService from "@/services/auth.service";
import {contacts} from "@/store/contacts.module";
import {messages} from "@/store/messages.module";
export default {
  name: "Chat-page",
  data() {
    return {
      contacts:[],
      errors:[],
      clickedChat:null,
      messageRecipient:null,
      messages:[],
      textMessage:null,
      sendMessage:{
        messageRecipientId:null,
        clickedChatId:null,
        text:null},
    }
  },

  mounted(){
    AuthService.tokenExpireCheck()
    this.getContacts()
  },
  methods:{
    getContacts(event) {
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

    mouseOverContactId(chatId,messageRecipientId)
    {
      this.$store.dispatch("messages/GetMessages", chatId).then(
          () => {
            try {
              this.messages = messages.state.messages
                  this.clickedChat = chatId,
                  this.messageRecipient = messageRecipientId
            }catch (e) {
              console.log("you have no masseges with this  user")
              return false;
            }
          },
          (error) => {
            this.message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
          }
      );
    },
    SendMessage(clickedChat,messageRecipient,textMessage)
    {
      this.sendMessage.clickedChatId=clickedChat
      this.sendMessage.messageRecipientId=messageRecipient
      this.sendMessage.text=textMessage
      this.$store.dispatch("messages/SendMessage", this.sendMessage).then(
          () =>
              this.$store.dispatch("messages/GetMessages",  this.sendMessage.clickedChatId),
          this.mouseOverContactId(this.sendMessage.clickedChatId,this.sendMessage.messageRecipientId),
          (error) => {
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
.block-contacts{width:30%;height:70%;overflow:auto;float:left}
.block-messages{width:70%;height:70%;overflow:auto}
.block-message{width:90%;height:30%;overflow:auto;float:left}
.block-send-button{width:10%;height:30%;overflow:auto;float:right }
.message-date{width:10%;}
.message-owner{width:50%;}
.message-recipient{width:50%;}
.message-receive-status{width:5%;}
.message-send-status{width:5%;}
</style>