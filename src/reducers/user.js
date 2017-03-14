import { SAVE_USER } from '../actions/types';

const defaultUser = {
  username: '',
  email: '',
  avatarUrl: '',
  githubId: '',
  githubData: {},
  fccCerts: {},
  skills: [],
  projects: [],
  interests: [],
  memberSince: '',
  verifiedUser: false
}

export default (state = defaultUser, action) => {
  switch (action.type) {

    case SAVE_USER:
      return action.user;

    default: return state;
  }
}
