const API_URL = 'http://localhost:8080/api/v1/';
import axios from 'axios';
import authHeader from './auth-header';


class MessagesService {

    GetMessages(chatId) {
            return axios
            .get(API_URL + 'messages/chat?chatId='+chatId,{ headers: authHeader(),
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
               console.log("r.response",r)
                if (r.status === 201) {
                    console.log("r.status === 201")
                    return "request sended";
                }
              // if (r.response.status === 201) {
              //     console.log("r.response.status === 201")
              //       return r.response.data;
              //   }
                if (r.response.status === 400) {
                    console.log("r.response 400",r.response.data)
                   return r.response.data;
                }
                    return r.data;
            });

    }

}

export default new MessagesService();
