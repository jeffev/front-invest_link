import axios from "axios";
import authService from "./auth.service";

const API_URL = "http://localhost:8080/api/v1/acao-usuario";

class AcaoUsuarioService {
  getAcoes() {
    return axios
      .get(API_URL, {
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  }

  adicionarAcao(acaoUsuario) {
    acaoUsuario.login = authService.getCurrentLogin();
    console.log(acaoUsuario);
    return axios.post(`${API_URL}/adicionar/`, acaoUsuario, {
      headers: {
        Authorization: `Bearer ${authService.getToken()}`,
      },
    });
  }

  removerAcao(id) {
    return axios.delete(API_URL + "/remover/" + id, {
      headers: {
        Authorization: `Bearer ${authService.getToken()}`,
      },
    });
  }

  editarAcao(acaoUsuario) {
    acaoUsuario.login = authService.getCurrentLogin();
    return axios.put(API_URL, acaoUsuario, {
      headers: {
        Authorization: `Bearer ${authService.getToken()}`,
      },
    });
  }
}

export default new AcaoUsuarioService();
