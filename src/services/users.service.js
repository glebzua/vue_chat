// const API_URL = 'http://localhost:8080/api/v1/';
const GetUsers_URL = 'http://localhost:8080/api/v1/users';
import axios from 'axios';
import authHeader from './auth-header';


class UsersService {
    GetUsers() {
        return axios
            .get(GetUsers_URL ,
                // { params: { page: 1 } },
                { headers: authHeader(),
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                withCredentials: true,
                credentials: 'same-origin',
                    params: { page: 1 },
                })
            .then(response => {
                 // console.log("UsersService GetUsers response.data - ",response.data)

                 return response.data;
            });
    }


}

export default new UsersService();
