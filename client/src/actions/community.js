import axios from 'axios';

export const POPULATE = 'POPULATE';
export const POPULATE_DEFAULT_STATS = 'POPULATE_DEFAULT_STATS';

const receiveCommunity = (users) => {
  return {
    type: POPULATE,
    users
  }
}

const createCommunityStats = (users) => {
  return {
    type: POPULATE_DEFAULT_STATS,
    users
  }
}

export const populateCommunity = () => {
  return dispatch => {
    return axios.get('/api/community').then(res => {
      const { users } = res.data;
      dispatch(receiveCommunity(users));
      dispatch(createCommunityStats(users));
    }).catch(err => console.log(err));
  }
};
