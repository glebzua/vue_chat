<template>
  <div class="block-contacts">
    <th>Contact</th>
    <tr
        v-for="(index) of contacts"
        id="app"
        :key="index"
    >
<!--      <td  v-if="index.chatId!==emptyChat" @click="openChat(index.chatId,index.contactId)" >-->
<!--        {{index.nickname}}</td>-->
      <td @click="openChat(index)" >
        {{index.nickname}}</td>
<!--      <td  v-if="index.chatId===emptyChat">-->
<!--        {{index.nickname}}- user  don't accept chat request from {{index.createdDate}}</td>-->

    </tr>
  </div>
  <div class="block-messages">  <th>Messages</th>
    <table > <td>{{messageState}}</td>
    </table>
    <table v-for="(index) of messages"
           :key="index">

      <td class="message-date"> {{index.createdDate}}</td>-->
      <td class="message-owner" v-if="messageRecipient===index.senderId" style="color: blue; text-align: left"> {{index.message}}</td>
      <td class="message-recipient" v-if="messageRecipient===index.recipientId" style="color: cornflowerblue ; text-align: right">{{index.message}}</td>
      <td class="message-receive-status" v-if="index.received===false && messageRecipient===index.recipientId" > <img
          src="../assets/not_receive-icon.png"
          width="25"
      ></td>
      <td v-else-if="index.received===true && messageRecipient===index.recipientId" > <img
          src="../assets/receive-icon.png"
          width="25"
      ></td>
      <td class="message-send-status" v-if="index.sended===false && messageRecipient===index.recipientId" > <img
          src="../assets/mail-send-icon.png"
          width="25"
      ></td>
      <td class="message-send-status" v-else-if="index.sended===true && messageRecipient===index.recipientId" > <img
          src="../assets/mail-sended-icon.png"
          width="25"
      ></td>
    </table>

  </div>
  <div class="block-message">
    <span>Message to id{{messageRecipient}} :</span>
    <input v-model="textMessage" placeholder="text here" @keyup.enter = "SendMessage(clickedChat,messageRecipient,textMessage)"/>
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
      // loading: false,
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
      emptyChat:'                                                            ',
      messageState:'',
      tempObj:null,
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
           // console.log("this.contacts -",this.contacts),
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

    openChat(messageObj)
    {this.messageState=""

      // console.log(messageObj,"||")
      if(messageObj.chatId===this.emptyChat){
        this.messageState="user don't accept chat request from "+messageObj.createdDate
        this.messages=""
        return
      }
     this.$store.dispatch("messages/GetMessages", messageObj.chatId).then(
          () => {
              try {
                    if(messages.state.messages===null){
                      this.messageState="you have no massages with this user!"
                    }
                  this.messages = messages.state.messages
                  this.clickedChat = messageObj.chatId
                  this.messageRecipient = messageObj.messageRecipientId
               }catch (e) {

              console.log("you have no massages with this  user",this.messageState)
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
       setTimeout(() => {
        this.openChat(this.sendMessage.clickedChatId,this.sendMessage.messageRecipientId);
      }, 400),

          this.textMessage=null,
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