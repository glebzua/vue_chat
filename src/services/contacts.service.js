const API_URL = 'http://localhost:8080/api/v1/';
import axios from 'axios';
import authHeader from './auth-header';


class ContactsService {
    GetContacts() {
        return axios
            .get(API_URL + 'contacts/my',{ headers: authHeader(),
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                withCredentials: true,
                credentials: 'same-origin',
                })
            .then(response => {
                // console.log("ContactsService GetContacts response.data - ",response.data)

                return response.data;
            });
    }


}

export default new ContactsService();
