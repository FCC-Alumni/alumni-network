import axios from 'axios';

export function getFrontEndCert(username) {
  return axios.get(`https://www.freecodecamp.org/${username}/front-end-certification`);
}

export function getBackEndCert(username) {
  return axios.get(`https://www.freecodecamp.org/${username}/back-end-certification`);
}

export function getDataVisCert(username) {
  return axios.get(`https://www.freecodecamp.org/${username}/data-visualization-certification`);
}
