import { POPULATE } from '../actions/community';
import { List } from 'immutable';

export default (state = List(), action) => {
  switch (action.type) {

    case POPULATE:
      return List(action.users);

    default: return state;
  }
}
