<template>

  <fieldset class="block-message"  :disabled="selectRecipient ? disabled : ''">
    <input class="block-message-text"
           v-model="textMessage" placeholder="text message here, tap Enter to send"
           @keyup.enter = "sendingMessage()">
    <input class="block-message-image"
           value=""
           type="file" id="file" accept="image/jpeg"
           @change="imageSelector"
    />
    <button class="block-message-image-submit"  id="imageSubmit" disabled  v-on:click="sendImage()">Submit</button>
  </fieldset>
  <div class="block-contacts" >
    <th>Contact</th>
    <tr
        v-for="(contIndex) of contacts"
        id="app"
        :key="contIndex"
    >
      <td  class="open-Cont"
           @click="openContact(contIndex)">
        {{contIndex.nickname}}-
      </td>
      <img v-if=unreadMessage(contIndex.contactId)
           src="../assets/new_message.png"
           alt="have new message"
           width="25">
    </tr>

  </div>
  <div class="block-messages">  <th>Messages</th>
    <table > <td>{{messageState}}</td> </table >
    <table v-for="(messagesIndex) of messages"
           :key="messagesIndex">

      <td class="message-date"> {{ messageDate(messagesIndex.createdDate )}}</td>

      <td :class=messageAlign(messagesIndex.senderId) >

        <img  v-if="messagesIndex.fileloc!==''"
              @click="openImage(messagesIndex.fileloc)"
              src="../assets/logo.png"
              alt="have image message"
              width="25">

        <transition class=" modal-overlay" @click="showModal = !showModal"
                    v-if="showImage(messagesIndex.fileloc)" >
          <img
              :src="img"
              alt="have image message"
          >
        </transition>
        {{messagesIndex.message}}</td>
      <td class="message-receive-status">
        <div v-if="messagesIndex.received===false && messageOwner(messagesIndex.recipientId)" >
          <img
              src="../assets/not_receive-icon.png"
              alt="sent message dont read"
              width="25">
        </div>
        <div v-else-if="messagesIndex.received===true && messageOwner(messagesIndex.recipientId)" >
          <img
              src="../assets/receive-icon.png"
              alt="sent message read"
              width="25">
        </div>
      </td>
      <td class="message-send-status">
        <div  v-if="messagesIndex.send===false && !messageOwner(messagesIndex.recipientId)" >
          <img
              src="../assets/mail-send-icon.png"
              alt="message sent"
              width="25">

        </div>
        <div   v-else-if="messagesIndex.send===true && messageOwner(messagesIndex.recipientId)" >
          <img
              src="../assets/mail-sent-icon.png"
              alt="message delivered"
              width="25">

        </div>

      </td>
    </table>

    <transition  v-if="havePreviousMessages()">
      <div class="load-previous-messages"
           @click="loadPreviousMessages()">
        tap to load previous messages
      </div>
    </transition>
  </div>

</template>

<script>
import AuthService from "@/services/auth.service";
import * as $state from "@/store/messages.module";
import {contacts} from "@/store/contacts.module";
import {messages} from "@/store/messages.module";
export default {
  name: "Contacts-page",
  data() {
    return {
      img:"",
      showModal: false,
      disabled:null,
      textMessage:"choose recipient first",
      messageState:null,
      messages:[],
      emptyChat:'                                                            ',
      messageRecipient:null,
      contacts: [],
      errors: [],
      pusherMessagesContacts: [],
      messageObj:{
        chatId:null,
        contactId:null,
        messagesPageInChat:1,
        text:null,
        imageSelector:null,
      },
    }
  },
  mounted() {
    try {
      $state.getMessages.state.recipientId=null
    }catch (e) {
      console.log(" $state.getMessages.state.recipientId",e)
    }
    try {
      $state.getMessages.state.chatId=null
    }catch (e) {
      console.log("$state.getMessages.state.chatId:",e)
    }
    try {
      $state.getMessages.state.getMessages.total=null
    }catch (e) {
      console.log("$state.getMessages.state.getMessages.total:",e)
    }
    this.messageRecipient=null
    this.getContacts()
    AuthService.tokenExpireCheck()
    try{
      this.contacts= this.$store.state.contacts.contacts
      const channel = this.$pusher.subscribe(localStorage.getItem('userId'));
      channel.bind('NewMessage', event => {
        this.pusherMessagesContacts.push(event)
      })
      console.log('subscribing to `my-channel`...', {
        $pusher: this.$pusher,
      })
    }catch (e){
      console.log("mounted contacts:",e)
    }
    this.hadNewMessages()
  },
  computed: {
    selectRecipient() {
      return this.messageRecipient !== null
    },
  },
  methods: {
    imageSelector() {
      try {
        document.getElementById('imageSubmit').disabled = document.getElementById("file").value === "";
      }catch (e) {
        console.log("imageSelector",e)
        return   true
      }},
    havePreviousMessages() {
      try{
        if(this.messages===null ) {
          return false
        }
        if(this.messages.length<$state.getMessages.state.getMessages.total) {
          return true
        }
      }catch (e) {
        console.log("havePreviousMessages error ",e)
        return false
      }
      return false
    },
    messageAlign(messageOwner){
      if(this.messageRecipient===messageOwner){
        return 'message-owner'
      }
      return 'message-send'
    },
    messageDate(timeN){
      let d = new Date(timeN);
      return d.toUTCString();
    },
    showImage(fileloc){
      return this.showModal && (fileloc !== '');

    },
    messageOwner(id){
      return id.toString() !== localStorage.getItem('userId');

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
    loadPreviousMessages(){
      this.messageObj.messagesPageInChat+=1
      this.$store.dispatch("getMessages/GetMessages", this.messageObj).then(
          () => {
            try {
              if($state.getMessages.state.getMessages===null){
                $state.getMessages.state.recipientId=null
                this.messageState="you have no massages with this user!"
              }
              $state.getMessages.state.getMessages.Message.forEach(
                  element =>this.messages.push(element)
              );
            }catch (e) {
              console.log("clickedCont error",e)
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
    openContact(messageObj){
      if(this.messageObj.chatId===messageObj.chatId){
        return
      }
      this.messageObj.chatId=messageObj.chatId
      this.messageObj.contactId=messageObj.contactId
      this.messageRecipient=messageObj.contactId
      this.messageObj.messagesPageInChat=1
      this.messageObj.createdDate=messageObj.createdDate
      this.clickedCont()
    },
    clickedCont(){
      if(this.messageObj.chatId===this.emptyChat){
        this.messageState="user don't accept chat request from "+this.messageDate(this.messageObj.createdDate)
        this.textMessage="cant send messages to this contact"
        this.messageRecipient=null
        return
      }
      this.textMessage=null
      this.messageState=""
      document.getElementById("file").value = ""
      document.getElementById('imageSubmit').disabled = true
      this.getMessages()
    },

    getMessages(){
      this.refreshMessagesList().then(
          () => {
            try {
              if($state.getMessages.state.getMessages.Message===null){
                $state.getMessages.state.recipientId=null
                this.messageState="you have no massages with this user!"
              }
              this.messages = messages.state.getMessages.Message
                  $state.getMessages.state.recipientId=this.messageObj.contactId
              $state.getMessages.state.chatId=this.messageObj.chatId
            }catch (e) {
              console.log("clickedCont error",e)
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
    refreshMessagesList(){
      return  this.$store.dispatch("getMessages/GetMessages", this.messageObj)
    },
    hadNewMessages(){
      this.$store.dispatch("hadNewMessages/HadNewMessages").then(
          () => {
          },
          (error) => {
            (error.response &&
                error.response.data &&
                error.response.data.message) ||
            error.message ||
            error.toString();
          }
      );
    },
    sendImage() {
      this.messageObj.imageSelector=document.querySelector('#file').files[0]
      this.$store.dispatch("sendImage/SendImage", this.messageObj).then(
          document.getElementById("file").value = "",
          document.getElementById('imageSubmit').disabled = true,
          setTimeout(() => {
                this.refreshMessagesList().then(
                    () => {this.messages = messages.state.getMessages.Message});
          }, 400),

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
    openImage(fileLoc){
      this.img=""
      this.showModal =!this.showModal
      this.$store.dispatch("openImage/OpenImage", fileLoc).then(
          response=>{
            this.img=response,
                (error) => {
                  this.message =
                      (error.response &&
                          error.response.data &&
                          error.response.data.message) ||
                      error.message ||
                      error.toString();
                }}
      );
    },
    sendingMessage()
    {
      if(this.textMessage===null){return}
      this.messageObj.text=this.textMessage
      this.$store.dispatch("messages/SendMessage", this.messageObj).then(
          setTimeout(() => {
            this.clickedCont();
          }, 200),
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
    checkAvailability(arr, val) {
      return arr.some((arrVal) => JSON.stringify(val) === JSON.stringify(arrVal))
    },
    unreadMessage(contactId){
      try{
        if(this.pusherMessagesContacts.length===0){
          return false
        }
        if(contactId===this.messageRecipient) {
          if((this.pusherMessagesContacts.find(item => item.NewMessageFrom === contactId))!==undefined) {
            this.pusherMessagesContacts.splice(this.pusherMessagesContacts.indexOf(this.pusherMessagesContacts.find(item => item.NewMessageFrom === this.messageRecipient)), 1)
            this.refreshMessagesList(this.messageObj).then(
                () => {
                  this.messages = messages.state.getMessages.Message})
          }
        }}catch (e) {
        console.log("unreadMessage e",e)
      }
      return  this.checkAvailability(this.pusherMessagesContacts, {NewMessageFrom:contactId})
    },
  }
}
</script>

<style scoped>
.block-contacts{width:25%;;overflow:auto;float:left}
.block-messages{width:70%;;overflow:auto;}
.block-message{width:100%;overflow:auto;float:left;border: solid;}
.block-message-text{width:50%;overflow:auto;float:left;border:none}
.block-message-image{width:40%;overflow:auto;float:left;border:none}
.block-message-image-submit{width:10%;overflow:auto;float:left;}
.message-date{min-width:15pc;}
.message-owner{width:45%;  color: blueviolet; text-align: left;}
.message-send{width:45%;color: green; text-align: right;}
.message-receive-status{width:2%;}
.message-send-status{width:2%;}
.load-previous-messages{width:54%;overflow:auto;float:right;}
.modal-overlay {
  position: fixed;
  top: 10%;
  bottom: 0;
  left: 30%;
  right: 0;
  display: flex;
  justify-content: flex-end;
  background-color: #fff;
  animation: 1s fadeIn;
}
@keyframes fadeIn{
  0% { opacity:0; }
  33% { opacity:0.1; }
  70% { opacity:0.2; }
  100% { opacity:1; }
}
</style>