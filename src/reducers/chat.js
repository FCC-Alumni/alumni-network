
import { NEW_MESSAGE } from '../actions/chat';

export default (state = [], action) => {
  switch (action.type) {
    case NEW_MESSAGE:
      return state.concat(action.data);
    default: return state;
  }
}
