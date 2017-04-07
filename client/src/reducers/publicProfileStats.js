import { SAVE_PROFILE_STATS } from '../actions/types';
import { POPULATE_DEFAULT_STATS } from '../actions/community';

const defaultStats = {
  firstChallenge: '',
  totalChallneges: '',
  longestStreak: '',
  currentStreak: '',
  browniePoints: '',
  isLoadingA: true,
  isLoadingB: true,
  isLoadingC: true,
  isLoadingD: true,
  isLoadingE: true,
  firstLoad: true,
}

export default (state = {}, action) => {
  switch (action.type) {

    case POPULATE_DEFAULT_STATS:
      var defaultState = {};
      action.users.forEach(user =>
        defaultState[user.username] = defaultStats);
      return defaultState;

    case SAVE_PROFILE_STATS:
      return Object.assign(state, action.stats);

    default: return state;
  }
}
