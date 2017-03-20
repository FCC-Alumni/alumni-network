import { SAVE_USER } from '../actions/types';
import { Map } from 'immutable';

const defaultUser = Map({
  githubId: '',
  username: '',
  verifiedUser: false,
  personal: {},
  fccCerts: {},
  mentorship: {},
  skillsAndInterests: {},
  projects: [],
  social: {},
  career: {}
});

export default (state = defaultUser, action) => {
  switch (action.type) {

    case SAVE_USER:
      return action.user;

    default: return state;
  }
}
