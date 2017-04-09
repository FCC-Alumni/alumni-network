/* eslint-disable */
import { SAVE_USER } from '../actions/types';
import { POPULATE } from '../actions/community';
import { NEW_USER_JOINED } from '../actions/onlineStatus';
import { List } from 'immutable';

export default (state = List(), action) => {
  switch (action.type) {

    case POPULATE:
      return List(action.users);

    case SAVE_USER:
      return state.map(user => {
        if (user.username === action.user.username) {
          return action.user;
        } else {
          return user;
        };
      });

    case NEW_USER_JOINED:
      return state.concat(action.payload);

    default: return state;
  }
}
