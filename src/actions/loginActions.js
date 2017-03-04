import axios from 'axios';

export function loginWithGithub() {
  axios.get('/auth/github')
}
