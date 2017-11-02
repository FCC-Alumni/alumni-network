import { LOGOUT_USER, SAVE_USER } from '../actions/user';

export const defaultUser = {
  career: {},
  fccCerts: {},
  githubId: '',
  mentorship: {},
  personal: {},
  projects: [],
  skillsAndInterests: {},
  social: {},
  username: '',
  verifiedUser: false,
};

export default (state = defaultUser, action) => {
  switch (action.type) {

    case SAVE_USER:
      return action.user;

    case LOGOUT_USER:
      return defaultUser;

    default:
      return state;
  }
}
