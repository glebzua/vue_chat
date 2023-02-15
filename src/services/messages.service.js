const API_URL = 'http://localhost:8080/api/v1/';
import axios from 'axios';
import authHeader from './auth-header';


class MessagesService {

    GetMessages(messageObj){
            return axios
            .get(API_URL + 'messages/chat/page?page='+messageObj.messagesPageInChat+'&chatId='+messageObj.chatId,{ headers: authHeader(),
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                withCredentials: true,
                credentials: 'same-origin',
                })
            .then(response => {
               return response.data;
            });
    }
    HadNewMessages() {
        return axios
            .get(API_URL + 'messages/uchats',{ headers: authHeader(),
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                withCredentials: true,
                credentials: 'same-origin',
            })
            .then(response => {
                return response.data;

            });
    }
    SendMessage(sendMessage) {
           return axios
                .post(API_URL + 'messages',{
                recipientId:sendMessage.messageRecipientId,
                chatId:sendMessage.clickedChatId,
                message:sendMessage.text,
            },{headers: authHeader(),
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                withCredentials: true,
                credentials: 'same-origin',})

            .then(response => {
                if (response.status === 201) {
                  return response.data;
                }
            return response.data;
            });
    }
    SendRequest(clickedUser) {
       return axios
                .post(API_URL + 'contacts',{
                contactId:clickedUser.userId,
                nickname:clickedUser.nickname,
                },{headers: authHeader(),
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                withCredentials: true,
                credentials: 'same-origin',})

            .then(r => {
                if (r.status === 201) {
                    return "request sended";
                }
                if (r.response.status === 400) {
                   return r.response.data;
                }
                    return r.data;
            });

    }

    OpenImage(imageId) {
        return axios
            .get(API_URL + 'images/'+imageId,{ headers: authHeader(),
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                withCredentials: true,
                credentials: 'same-origin',
            })
            .then(response => {
                return response.data;
            });
    }
    SendImage(sendImageObj) {
        return axios
            .post(API_URL + 'images?chatId='+sendImageObj.chatId+'&recipientId='+sendImageObj.contactId,sendImageObj.formData,
            {headers: authHeader(),
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'image/jpg',
                  withCredentials: true,
                credentials: 'same-origin',})

            .then(response => {
                if (response.status === 201) {
                    return response.data;
                }
                return response.data;
            });
    }
}

export default new MessagesService();
