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
            const user = await response.json();
            sessionStorage.setItem("user", JSON.stringify(user));
        }

        return response;
    }

    logout() {
        sessionStorage.removeItem("user");
    }

    async register(nome, sobrenome, login, email, password) {
        const response = await fetch(API_URL + "api/v1/usuario/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome,
                sobrenome,
                login,
                email,
                password
            }),
        });

        if (response.ok) {
            const user = await response.json();
            sessionStorage.setItem("user", JSON.stringify(user));
        }

        return response;
    }

    getCurrentUser() {
        const user = JSON.parse(sessionStorage.getItem('user'));
        return user ? user.nome : null;
    }

    getCurrentLogin() {
        const user = JSON.parse(sessionStorage.getItem('user'));
        return user ? user.login : null;
    }

    getToken() {
        const user = JSON.parse(sessionStorage.getItem('user'));
        return user ? user.token : null;
    }

    getAuth() {
        const user = sessionStorage.getItem('user');
        return (user ? true : false);
    }
}

export default new AuthService();
