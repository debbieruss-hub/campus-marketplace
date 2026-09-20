import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Express server endpoint
  withCredentials: true, // Sends HTTP-only cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;