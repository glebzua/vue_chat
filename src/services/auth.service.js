import axios from 'axios';
import authHeader from "@/services/auth-header";

const API_URL = 'http://localhost:8080/api/v1/';



class AuthService {
  login(user) {
    return axios
      .post(API_URL + 'auth/login', {
        email: user.userEmail,
        password: user.password
      })
      .then(response => {
        localStorage.setItem('user', response.data.token);
        localStorage.setItem('userId', response.data.user.id);
        localStorage.setItem('loggedIn', 'true');

         localStorage.setItem('TokenExpireDate', tokenExpireDate());
        return response.data;
      });
  }

 logout() {
     logouts()
   }
  tokenExpireCheck() {
    try{
      if (localStorage.getItem('TokenExpireDate')!=null) {
        let tokenExpireCheck = localStorage.getItem('TokenExpireDate');
        let dateNow = Date.now();
        if(dateNow > tokenExpireCheck){
          alert("token expired, please re-login");
          logouts()
        }
      }
    }catch (e) {
      alert("error during  TokenExpireDate check");
    }
  }
    registration(user) {
        return axios.post(API_URL + 'auth/register', {
        email: user.email,
        password: user.password,
        name: user.username,
        phoneNumber:user.phoneNumber
},
          {headers: authHeader(),
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          withCredentials: true,
          credentials: 'same-origin',})
          .then(response => {
          localStorage.setItem('user', response.data.token);
          localStorage.setItem('userId', response.data.user.id);
          localStorage.setItem('loggedIn', 'true');

          localStorage.setItem('TokenExpireDate', tokenExpireDate());
          return response.data;
      });

    }
}
function logouts() {

    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.setItem('loggedIn', 'false');
    localStorage.removeItem('TokenExpireDate');
    window.location.replace('/login')
}
function tokenExpireDate() {
  let now = Date.now();
  now+=3600000
  return now;
}


export default new AuthService();
