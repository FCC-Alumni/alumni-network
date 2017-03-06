import axios from 'axios';

export function getUserData() {
  return axios.get('/api/user').then(res => { return res.data });
}
