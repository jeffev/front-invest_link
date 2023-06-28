import axios from "axios";

const API_URL = "http://localhost:8080/";

class AuthService {
    async login(login, password) {
        const response = await fetch(API_URL + "login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login, password }),
        });

        if (response.ok) {
            const token = await response.text(); 
            localStorage.setItem("token", token);
        }
        
        return response;
    }

    logout() {
        localStorage.removeItem("token");
    }

    register(login, password) {
        return axios.post(API_URL + "/api/v1/usuario/register", {
            login,
            password
        });
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('token'));
    }

    getAuth() {
        const token = JSON.parse(localStorage.getItem('token'));
        return (token ? true : false);
    }
}

export default new AuthService();