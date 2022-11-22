const API_URL = 'http://localhost:8080/api/v1/';
import axios from 'axios';
import authHeader from './auth-header';


class MessagesService {

    GetMessages(chatId) {
        // console.log("GetMessages event-messages",chatId)
        return axios
            //
            // .get(API_URL + 'messages/my',{ headers: authHeader(),
                .get(API_URL + 'messages/chat?chatId='+chatId,{ headers: authHeader(),
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                withCredentials: true,
                credentials: 'same-origin',
                })

            .then(response => {
                 // console.log("MessagesService GetMessages response.data - ",response.data)

                return response.data;
            });
    }


}

export default new MessagesService();
