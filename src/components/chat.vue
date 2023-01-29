<template>
  <input class="block-message"  :disabled="selectRecipient ? disabled : ''"
         v-model="textMessage" placeholder="textMessage"
         @keyup.enter = "SendMessage(clickedChat,messageRecipient,textMessage)"
         style="width: 100%">
   <div class="block-contacts">
    <th>Contact</th>
    <tr
        v-for="(contIndex) of contacts"
        id="app"
        :key="contIndex"
    >
     <td @click="clickedCont(contIndex)" >
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
      <td class="message-date"> {{messagesIndex.createdDate}}</td>-->
      <td class="message-owner" v-if="messageOwner(messagesIndex.senderId)">{{messagesIndex.message}}</td>
      <td class="message-recipient" v-if="!messageOwner(messagesIndex.senderId)">{{messagesIndex.message}}</td>
      <td class="message-receive-status">
        <div v-if="messagesIndex.received===false && messageRecipient===messagesIndex.recipientId" >
              <img
              src="../assets/not_receive-icon.png"
              width="25">
        </div>
        <div v-else-if="messagesIndex.received===true && messageRecipient===messagesIndex.recipientId" >
               <img
               src="../assets/receive-icon.png"
               width="25">
        </div>
      </td>
      <td class="message-send-status">
        <div class="message-send-status" v-if="messagesIndex.sended===false && messageRecipient===messagesIndex.recipientId" >
          <img
          src="../assets/mail-send-icon.png"
           width="25">

        </div>
        <div class="message-send-status" v-else-if="messagesIndex.sended===true && messageRecipient===messagesIndex.recipientId" >
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
import {getMessages, messages} from "@/store/messages.module";
import * as $state from "@/store/messages.module";
import {contacts} from "@/store/contacts.module";

export default {
  name: "Contacts-page",

  data() {
    return {
      localStorageUserId:null,
      clickedChat:null,
      textMessage:"choose recipient first",
      tmp:null,
      messageState:null,
      messages:[],
      emptyChat:'                                                            ',
      messageRecipient:null,
      contacts: [],
      errors: [],
      pusherMessagesContacts: [],
      sendMessage:{
        messageRecipientId:null,
        clickedChatId:null,
        text:null},
    }
  },

  mounted() {

    this.messageRecipient=null
    this.localStorageUserId=localStorage.getItem('userId')
    this.getContacts()
    AuthService.tokenExpireCheck()
    try{
      if ($state.getMessages.state.chatId != null) {
        this.clickedChat = $state.getMessages.state.chatId
      }

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


    return this.messageRecipient !== null ? true : false


  },
},
  methods: {
    messageOwner(id){
      if (id.toString()===this.localStorageUserId){
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
      this.textMessage=null
      this.messageState=""
      this.tmp=null
      if(messageObj.chatId===this.emptyChat){
        this.messageState="user don't accept chat request from "+messageObj.createdDate
        this.messages=""
        this.messageRecipient=null
        this.textMessage="cant send messages to this contact"

        return
      }
      this.$store.dispatch("getMessages/GetMessages", messageObj.chatId).then(
          () => {
            try {
              if(getMessages.state.getMessages===null){
                  $state.getMessages.state.recipientId=null
                this.messageState="you have no massages with this user!"
              }
              this.messages = $state.getMessages.state.getMessages
              $state.getMessages.state.recipientId=messageObj.contactId
              $state.getMessages.state.chatId=messageObj.chatId
              this.clickedChat = messageObj.chatId
              this.messageRecipient = messageObj.contactId
              this.pusherMessagesContacts.splice(this.pusherMessagesContacts.indexOf({
                "NewMessageFrom": messageObj.contactId
              }), 1);
               }catch (e) {
              console.log("clickedCont",e)
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
    SendMessage(clickedChat,messageRecipient,textMessage)
    {
      this.sendMessage.clickedChatId=clickedChat
      this.sendMessage.messageRecipientId=messageRecipient
      this.sendMessage.text=textMessage
       this.$store.dispatch("messages/SendMessage", this.sendMessage).then(

          this.messages = messages.state.getMessages,

          setTimeout(() => {
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
        if(this.pusherMessagesContacts.length>0 && contactId!=null){
            if(contactId===this.messageRecipient){
            this.clickedCont({chatId:$state.getMessages.state.chatId,
              contactId:$state.getMessages.state.recipientId})
            return
          }
        }

      }catch (e) {
        console.log("haveUnreadMessage", e)
      }
      return  this.checkAvailability(this.pusherMessagesContacts, {NewMessageFrom:contactId})

    },

  }
}

</script>

<style scoped>
.block-contacts{width:30%;height:85%;overflow:auto;float:left}
.block-messages{width:70%;height:85%;overflow:auto}
.block-message{width:100%;overflow:auto;float:left}
/*.block-message{background:#212529;color:rgba(255,255,255,.55);width:90%;height:8.1%;overflow:auto;float:left}*/
/*.block-send-button{background:#212529;color:rgba(255,255,255,.55);width:10%;height:8.1%;overflow:auto;float:right }*/
.message-date{width:10%;}
.message-owner{width:50%;  color: blueviolet; text-align: left}
.message-recipient{width:50%;color: green; text-align: right}
.message-receive-status{width:5%;}
.message-send-status{width:5%;}
</style>

