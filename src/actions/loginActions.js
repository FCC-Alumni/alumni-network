import axios from 'axios';
import { withRouter } from 'react-router-dom';

export function getUserData() {
  return axios.get('/api/user').then(res => { return res.data });
}

export function verifyUser(username, mongoId) {
  return axios.post('/api/verify-credentials', { username, mongoId } );
}
