import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://stock-reservation-system.onrender.com',
});