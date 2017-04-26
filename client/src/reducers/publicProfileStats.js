
import { POPULATE_USER_STATS } from '../actions/scrape-fcc.js';
import { Map } from 'immutable';

export default (state = Map(), action) => {
  const { type, payload } = action;
  switch (type) {

    case POPULATE_USER_STATS:
      return state.set(payload.user, payload.stats);

    default: return state;
  }
}
