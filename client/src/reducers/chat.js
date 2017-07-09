import {
  CHAT_ADD_MESSAGE,
  CHAT_DELETE_MESSAGE,
  CHAT_EDIT_MESSAGE,
  CHAT_INITIALIZE,
  CHAT_LIKE_MESSAGE,
  CHAT_RECEIVED_LIKE,
  CHAT_RECEIVED_MESSAGE,
  CHAT_RECEIVED_UPDATE
} from '../actions/chat';
import { List, Map } from 'immutable';

/*** Chat history is a List. Each entry represents
 * a message and is a Map, within which likes are
 * represented as a Set ***/

export default (state = List(), action) => {
  const { type, payload } = action;

  switch (type) {

    case CHAT_INITIALIZE:
      return (payload.length > 0) ? List(action.payload) : state;

    case CHAT_ADD_MESSAGE:
      return state.push(action.payload);

    case CHAT_EDIT_MESSAGE:
      return state.map(message => {
        if (message.get('id') === payload.id) {
          return message
            .set('text', payload.text)
            .set('edited', true);
        } else {
          return message;
        }
      });

    case CHAT_LIKE_MESSAGE:
      const { messageId, liker } = payload;
      return state.map(message => {
        if (message.get('id') === messageId && !message.get('likes').has(liker)) {
            return message.update('likes', likes => likes.add(liker))
        } else {
          return message;
        }
      });

    case CHAT_DELETE_MESSAGE:
      return state.filter(message => message.get('id') !== payload.id);

    case CHAT_RECEIVED_MESSAGE:
      return state.push(Map(action.payload));

    case CHAT_RECEIVED_UPDATE:
      return state.map(message => {
        if (message.get('id') === payload.id) {
          return Map(payload);
        } else {
          return message;
        }
      });

    case CHAT_RECEIVED_LIKE:
      return state.map(message => {
        if (message.get('id') === payload.messageId) {
          return message.update('likes', likes => likes.add(payload.liker));
        } else {
          return message;
        }
      });

    default: return state;
  }
}
