import axios from 'axios';
import authService from './auth.service';

const API_URL = 'http://localhost:8080/api/v1/';

const AcaoService = {
  getAcoes: () => {
    return axios.get(API_URL + 'acoes/', {
      headers: {
        Authorization: `Bearer ${authService.getToken()}`
      }
    })
      .then(response => response.data)
      .catch(error => {
        console.log(error);
        throw error;
      });
  },

  adicionarFavorita: (ticker) => {
    return axios.post(API_URL + `usuario/adicionarFavorita/${ticker}`, null, {
      headers: {
        Authorization: `Bearer ${authService.getToken()}`
      }
    })
      .then(response => response.data)
      .catch(error => {
        console.log(error);
        throw error;
      });
  },

  removerFavorita: (ticker) => {
    return axios.delete(API_URL + `usuario/removerFavorita/${ticker}`, {
      headers: {
        Authorization: `Bearer ${authService.getToken()}`
      }
    })
      .then(response => response.data)
      .catch(error => {
        console.log(error);
        throw error;
      });
  }
};

export default AcaoService;
