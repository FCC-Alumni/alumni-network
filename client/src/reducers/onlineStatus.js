/* eslint-disable */
import { POPULATE_ONLINE_USERS, USER_ONLINE, USER_OFFLINE } from '../actions/onlineStatus';
import { Set } from 'immutable';

export default (state = Set(), action) => {
  const { type, payload } = action;
  switch (type) {

    case POPULATE_ONLINE_USERS:
    return payload.reduce((state, user) => {
      return state.add(user);
    }, state);

    case USER_ONLINE:
      return state.add(payload);

    case USER_OFFLINE:
      return state.remove(payload);

    default: return state;
  }
};
