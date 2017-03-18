
import { List, Map } from 'immutable';
import {
  INITIALIZE,
  ADD_MESSAGE,
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
      if (payload.length > 0) {
        return List(action.payload);
      } else {
        return state;
      }

    case ADD_MESSAGE:
      return state.push(action.payload);

    case LIKE_MESSAGE:
      return state.map(message => {
        if (message.get('id') === payload.messageId) {
          return message.update('likes', likes => {
            return (likes.indexOf(payload.liker) === -1 ? likes.concat(payload.liker) : likes);
          });
        } else {
          return message;
        }
      });

    case EDIT_MESSAGE:
      return state.map(message => {
        if (message.get('id') === payload.id) {
          return message.set('text', payload.text);
        } else {
          return message;
        }
      });

    case RECEIVED_LIKE:
      return state.map(message => {
        if (message.get('id') === payload.messageId) {
          return message.update('likes', likes => likes.concat(payload.liker));
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
