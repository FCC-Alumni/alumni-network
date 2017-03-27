/* eslint-disable */
import { USER_ONLINE, USER_OFFLINE } from '../actions/onlineStatus';
import { Set } from 'immutable';

export default (state = Set(), action) => {
  const { type, user } = action;
  switch (type) {

    case USER_ONLINE:
      return state.add(user);

    case USER_OFFLINE:
      return state.remove(user);

    default: return state;
  }
};
