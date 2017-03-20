import axios from 'axios';
import { Map } from 'immutable';
// import { withRouter } from 'react-router-dom';
import { SAVE_USER } from './types';

export const getUserData = () => {
  return axios.get('/api/user').then(res => res.data)
    .catch(console.log);
}

export const verifyUser = (username, mongoId) => {
  return axios.post('/api/verify-credentials', { username, mongoId });
}

export const saveUser = (user) => {
  return {
    type: SAVE_USER,
    user: Map(user)
  }
}

export const updateUser = (user) => {
  return axios.post('/api/update-user', { user });
}