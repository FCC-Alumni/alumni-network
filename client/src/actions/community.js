import axios from 'axios';

export const POPULATE = 'POPULATE';

const receiveCommunity = (users) => {
  return {
    type: POPULATE,
    users
  }
}

export const populateCommunity = () => {
  return dispatch => {
    return axios.get('/api/community').then(res => {
      const { users } = res.data;
      dispatch(receiveCommunity(users));
    }).catch(err => console.error(err));
  }
};
