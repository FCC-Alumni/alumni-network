import { Map } from 'immutable';
import { POPULATE_USER_STATS } from '../actions/scrape-fcc.js';

export default (state = Map(), action) => {
  const { type, payload } = action;
  switch (type) {

    case POPULATE_USER_STATS:
      if (!payload.user) return state;
      return state.set(payload.user, payload.stats);

    default:
      return state;
  }
}
