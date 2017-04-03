import axios from 'axios';
import {
  SAVE_USER,
  LOGOUT_USER,
  VIEW_THIS_USER,
  SAVE_SEARCH_STATE,
  SAVE_PROFILE_VIEW_STATE,
} from './types';

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

export const logoutUser = () => {
  return {
    type: LOGOUT_USER
  }
}

export const saveSearchState = (searchState) => {
  return {
    type: SAVE_SEARCH_STATE,
    searchState
  }
}

export const saveViewState = (profileView) => {
  return {
    type: SAVE_PROFILE_VIEW_STATE,
    profileView
  }
}

export const viewThisUser = (user) => {
  return {
    type: VIEW_THIS_USER,
    user
  }
}
