
import { List, Map } from 'immutable';
import {
  INITIALIZE,
  ADD_MESSAGE,
  DELETE_MESSAGE,
  EDIT_MESSAGE,
  LIKE_MESSAGE,
  RECEIVED_MESSAGE,
  RECEIVED_UPDATE,
  RECEIVED_LIKE
} from '../actions/chat';

export default (state = List(), action) => {
  const { type, payload } = action;

  switch (type) {

    case INITIALIZE:
      return (payload.length > 0) ? List(action.payload) : state;

    case ADD_MESSAGE:
      return state.push(action.payload);

    case DELETE_MESSAGE:
        return state.filter(message => message.get('id') !== payload.id);

    case EDIT_MESSAGE:
      return state.map(message => {
        if (message.get('id') === payload.id) {
          return message.set('text', payload.text);
        } else {
          return message;
        }
      });

    case LIKE_MESSAGE:
      const { messageId, liker } = payload;
      return state.map(message => {
        if (message.get('id') === messageId && !message.get('likes').has(liker)) {
            return message.update('likes', likes => likes.add(liker))
        } else {
          return message;
        }
      });

    case RECEIVED_LIKE:
      return state.map(message => {
        if (message.get('id') === payload.messageId) {
          return message.update('likes', likes => likes.add(payload.liker));
        } else {
          return message;
        }
      });

    case RECEIVED_MESSAGE:
      return state.push(Map(action.payload));

    case RECEIVED_UPDATE:
      return state.map(message => {
        if (message.get('id') === payload.id) {
          return Map(payload);
        } else {
          return message;
        }
      });

    default: return state;
  }
}
