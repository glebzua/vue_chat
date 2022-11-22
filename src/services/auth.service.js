import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/';



class AuthService {
  login(user) {
    // console.log(user,"-----AuthService user")
    return axios
      .post(API_URL + 'auth/login', {
        email: user.userEmail,
        password: user.password
      })
      .then(response => {
        localStorage.setItem('state.auth.user.role', response.data.role);
        localStorage.setItem('user', response.data.token);
        localStorage.setItem('loggedIn', 'true');

         localStorage.setItem('TokenExpireDate', tokenExpireDate());
        return response.data;
      });
  }

 logout() {
     logouts()
    // AuthService.logouts()
    // localStorage.removeItem('user');
    // localStorage.removeItem('role');
    // localStorage.removeItem('state.auth.user.role');
    // localStorage.setItem('loggedIn', 'false');
    // // localStorage.removeItem('TokenExpireDate');
    // window.location.replace('/login')

    // localStorage.setItem(('TokenExpireDateStatus'),'false')
  }
  tokenExpireCheck() {
    try{
      if (localStorage.getItem('TokenExpireDate')!=null) {
        let tokenExpireCheck = localStorage.getItem('TokenExpireDate');
        let dateNow = Date.now();
        // console.log("tokenExpireCheck=", tokenExpireCheck)
        // console.log("dateNow=", dateNow)
        // console.log("dateNow>tokenExpireCheck=", dateNow > tokenExpireCheck)
        if(dateNow > tokenExpireCheck){
          alert("token expired, please re-login");
          logouts()
        }
        // console.log(this.$store.state.auth.user.role," -currentUser role !=null")
      }
    }catch (e) {
      alert("error during  TokenExpireDate check");
    }


    // let tokenExpireCheck = localStorage.getItem('TokenExpireDate');
    // let dateNow = Date.now();
    // console.log("tokenExpireCheck=", tokenExpireCheck)
    // console.log("dateNow=", dateNow)
    // console.log("dateNow>tokenExpireCheck=", dateNow > tokenExpireCheck)
    // if(dateNow > tokenExpireCheck){
    //   alert("token expired, please re-login");



  }
  // register(user) {
  //   return axios.post(API_URL + 'signup', {
  //     username: user.username,
  //     email: user.email,
  //     password: user.password
  //   });
  // }

}
function logouts() {

    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('state.auth.user.role');
    localStorage.setItem('loggedIn', 'false');
    localStorage.removeItem('TokenExpireDate');
    window.location.replace('/login')
}
function tokenExpireDate() {
  let now = Date.now();
 // console.log(now,"now+3600000")
now+=3600000
  return now;
}


export default new AuthService();
