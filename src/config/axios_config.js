import { API_BASE_URL } from "../constants/url";
import axios from "axios";

const client = axios.create({
    baseUrl: API_BASE_URL,
});

client.defaults.baseURL = API_BASE_URL;

client.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token !== null) {
      config.defaults.headers['Authorization'] = token;
    }
  
    return config;
  }, error => {
    return Promise.reject(error);
  });

export default client;