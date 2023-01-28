const GetUsers_URL = 'http://localhost:8080/api/v1/users';
import axios from 'axios';
import authHeader from './auth-header';


class UsersService {
    GetUsers() {
        return axios
            .get(GetUsers_URL ,
                  { headers: authHeader(),
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                withCredentials: true,
                credentials: 'same-origin',
                })
            .then(response => {

                 return response.data;
            });
    }


}

export default new UsersService();
