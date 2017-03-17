
import { List } from 'immutable';
import { INITIALIZE, ADD_MESSAGE, RECEIVED_MESSAGE } from '../actions/chat';

export default (state = List(), action) => {
  const { type, payload } = action;
  switch (type) {

    case INITIALIZE:
      if (payload.length > 0) {
        return List(action.payload);
      } else {
        return state;
      }

    case ADD_MESSAGE:
      return state.push(action.payload);

    case RECEIVED_MESSAGE:
      return state.push(action.payload);

    default: return state;
  }
}
