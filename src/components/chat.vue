<template>
  <div class="block-message"  >
    <input class="block-message-text" :disabled="selectRecipient ? disabled : ''"
           v-model="textMessage" placeholder="text message here, tap Enter to send"
           @keyup.enter = "sendingMessage()">
    <input class="block-message-image" :disabled="selectRecipient ? disabled : ''"
           type="file" id="file" ref="file" accept="image/jpeg"
           placeholder="drop image here, tap Enter to send"/>
    <button class="block-message-image-submit" v-on:click="sendImage()">Submit</button>
  </div>


  <div class="block-contacts" >
    <th>Contact</th>
    <tr
        v-for="(contIndex) of contacts"
        id="app"
        :key="contIndex"
    >
      <td  class="clicked-Cont"
          @click="clickedCont(contIndex),clickCont=contIndex.contactId">
        {{contIndex.nickname}}-
      </td>
      <img v-if="haveUnreadMessage(contIndex.contactId)"
           src="../assets/new_message.png"
           width="25"
      >
    </tr>

  </div>
  <div class="block-messages">  <th>Messages</th>
    <table > <td>{{messageState}}</td>
    </table>
    <table v-for="(messagesIndex) of messages"
           :key="messagesIndex">

      <td class="message-date"> {{ messageDate(messagesIndex.createdDate )}}</td>

      <td :class=messageAlign(messagesIndex.senderId) >

          <img  v-if="messagesIndex.fileloc!==''"
               @click="openImage(messagesIndex.fileloc)"
              src="../assets/logo.png"
              width="25">

          <transition class=" modal-overlay" @click="showModal = !showModal"
                      v-if="showImage(messagesIndex.fileloc)" >
          <img
               :src="img"
          >
        </transition>
        {{messagesIndex.message}}</td>
        <td class="message-receive-status">
        <div v-if="messagesIndex.received===false && messageOwner(messagesIndex.recipientId)" >
          <img
              src="../assets/not_receive-icon.png"
              width="25">
        </div>
        <div v-else-if="messagesIndex.received===true && messageOwner(messagesIndex.recipientId)" >
          <img
              src="../assets/receive-icon.png"
              width="25">
        </div>
      </td>
      <td class="message-send-status">
        <div  v-if="messagesIndex.sended===false && !messageOwner(messagesIndex.recipientId)" >
          <img
              src="../assets/mail-send-icon.png"
              width="25">
        </div>
        <div   v-else-if="messagesIndex.sended===true && messageOwner(messagesIndex.recipientId)" >
          <img
              src="../assets/mail-sended-icon.png"
              width="25">

        </div>

      </td>
    </table>
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

      clickCont:null,
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
      },
      sendMessage:{
        messageRecipientId:null,
        clickedChatId:null,
        text:null},
      sendImageObj : {
        chatId: null,
        contactId: null,
        formData:null
      },
    }
  },
  mounted() {
    $state.getMessages.state.recipientId=null
    $state.getMessages.state.chatId=null
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
      if(this.showModal && (fileloc!=='')){
        return true
      }
      return false
    },

    messageOwner(id){

      if (id.toString()===localStorage.getItem('userId')){
        return false
      }
      return true
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
    clickedCont(messageObj){
      if (this.clickCont===messageObj.contactId){
         return
      }
      this.messageRecipient=messageObj.contactId

      if((this.pusherMessagesContacts.find(item => item.NewMessageFrom === messageObj.contactId))!==undefined) {


        this.pusherMessagesContacts.splice(this.pusherMessagesContacts.indexOf(this.pusherMessagesContacts.find(item => item.NewMessageFrom === this.messageRecipient)), 1)

      }

        this.textMessage=null
      this.messageState=""
      if(messageObj.chatId===this.emptyChat){
        this.messageState="user don't accept chat request from "+messageObj.createdDate
        this.messages=""
        this.messageRecipient=null
        this.textMessage="cant send messages to this contact"

        return
      }
      this.getMessages(messageObj)
    },

    getMessages(messageObj){

      this.$store.dispatch("getMessages/GetMessages", messageObj.chatId).then(
          () => {
            try {
              if($state.getMessages.state.getMessages===null){
                $state.getMessages.state.recipientId=null
                this.messageState="you have no massages with this user!"
              }
              this.messages = $state.getMessages.state.getMessages
              $state.getMessages.state.recipientId=messageObj.contactId
              $state.getMessages.state.chatId=messageObj.chatId
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
    hadNewMessages(){
      this.$store.dispatch("hadNewMessages/HadNewMessages").then(
          () => {
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
    sendImage() {
         try {
          this.sendImageObj.chatId = $state.getMessages.state.chatId,
          this.sendImageObj.contactId = $state.getMessages.state.recipientId
          this.sendImageObj.formData=document.querySelector('#file').files[0]
        } catch (e) {
          console.log(e, this.sendImageObj)
        }

        this.$store.dispatch("sendImage/SendImage", this.sendImageObj).then(
            this.clickCont=null,
              setTimeout(() => {
                  this.clickedCont({chatId:this.sendImageObj.chatId,
                    contactId:this.sendImageObj.contactId});
            }, 600),
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
    this.sendMessage.clickedChatId= $state.getMessages.state.chatId
    this.sendMessage.messageRecipientId= $state.getMessages.state.recipientId
      this.sendMessage.text=this.textMessage
      this.$store.dispatch("messages/SendMessage", this.sendMessage).then(

          this.messages = messages.state.getMessages,

          setTimeout(() => {
            this.clickCont=null
            this.clickedCont({chatId:this.sendMessage.clickedChatId,
              contactId:this.sendMessage.messageRecipientId});
          }, 800),

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
    checkAvailability(arr, val) {
      return arr.some((arrVal) => JSON.stringify(val) === JSON.stringify(arrVal))
    },
    haveUnreadMessage(contactId){
       try{
         if(this.pusherMessagesContacts.length===0){
           return

         }
         if(this.pusherMessagesContacts.length>0 && contactId!=null){

          if(contactId===this.messageRecipient){

            this.clickCont=null,
            this.clickedCont({chatId:$state.getMessages.state.chatId,
              contactId:$state.getMessages.state.recipientId})
            return
          }
        }

      }catch (e) {
        console.log("haveUnreadMessage error:", e)
      }
         return  this.checkAvailability(this.pusherMessagesContacts, {NewMessageFrom:contactId})

    },

  }
}

</script>

<style scoped>
.block-contacts{width:25%;height:85%;overflow:auto;float:left}
.block-messages{width:70%;height:85%;overflow:auto;}
.block-message{width:100%;overflow:auto;float:left;border: solid;}
.block-message-text{width:50%;overflow:auto;float:left;border:none}
.block-message-image{width:40%;overflow:auto;float:left;border:none}
.block-message-image-submit{width:10%;overflow:auto;float:left;}
.message-date{min-width:15pc;}
.message-owner{width:45%;  color: blueviolet; text-align: left;}
.message-send{width:45%;color: green; text-align: right;}
.message-receive-status{width:2%;}
.message-send-status{width:2%;}


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
  66% { opacity:0.3; }
  100% { opacity:1; }
}


</style>

