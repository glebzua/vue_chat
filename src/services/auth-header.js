export default function authHeader() {
  // let user = JSON.parse(localStorage.getItem('user'));
  // let role = JSON.parse(localStorage.getItem('role'));

    try{
        if (localStorage.getItem('user') !=null) {
//store.state.auth.status.loggedIn
            // console.log("localStorage.getItem('user') -", localStorage.getItem('user') )
            return { Authorization: 'Bearer ' + localStorage.getItem('user') };
            // console.log(this.$store.state.auth.user.role," -currentUser role !=null")
        }
    }catch (e) {
        console.log("authHeader  catch error")

    }
  //
  // if (user!=null && user.accessToken && role) {
  //   return { Authorization: 'Bearer ' + localStorage.getItem('user') }; // for Spring Boot back-end
  //   // return { 'x-access-token': user.accessToken };       // for Node.js Express back-end
  // } else {
  //   return {};
  // }
}
