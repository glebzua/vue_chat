import axios from "axios";
import AuthService from "@/services/auth.service";
//  AIzaSyDSNribyJeEAa0PqGzs5W-ujg3Rb5Fy-0Q
// axios.defaults.baseURL = 'http://localhost:8081/';

let refresh = false;

axios.interceptors.response.use(resp => resp, async error => {
    if (error.response.status === 401 && !refresh) {
        refresh = true;

        // logout({ commit }) {
        //     AuthService.logout();
        window.location.href="http://localhost:8081/login"
        //     commit('logout');
        // },
        const {status, data} = await axios.post('login', {}, {
           withCredentials: true
        });

        if (status === 200) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

            return axios(error.config);
        }
        if (status === 404) {
            AuthService.logout();
            window.location.href="http://localhost:8081/login"
            return axios(error.config);
        }
    }
    refresh = false;
    return error;
});
