import { SAVE_USER } from '../actions/types';
import { POPULATE } from '../actions/community';
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

    default: return state;
  }
}
