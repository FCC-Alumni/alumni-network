import axios from 'axios';
import { SAVE_USER } from './types';

export const getUserData = () => {
  return axios.get('/api/user')
    .then(res =>  res.data)
    .catch(err => null);
}

export const verifyUser = (username, mongoId) => {
  return axios.post('/api/verify-credentials', { username, mongoId });
}

export const saveUser = (user) => {
  return {
    type: SAVE_USER,
    user: user
  }
}

export const updateUser = (user) => {
  return axios.post('/api/update-user', { user });
}
