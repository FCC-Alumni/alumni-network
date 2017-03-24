
import { List, Map, Set } from 'immutable';
import {
  POPULATE_PRIVATE,
  INITIALIZE_PRIVATE,
  ADD_MESSAGE_PRIVATE,
  EDIT_MESSAGE_PRIVATE,
  DELETE_MESSAGE_PRIVATE,
  LIKE_MESSAGE_PRIVATE,
  RECEIVED_LIKE_PRIVATE,
  RECEIVED_MESSAGE_PRIVATE,
  RECEIVED_UPDATE_PRIVATE,
} from '../actions/chat';

export default (state = Map(), action) => {
  const { type, payload } = action;

  switch (type) {

    case POPULATE_PRIVATE:
      const { user, data } = payload;
      // we basically need to do some conversions to the data...
      data.map(data => {
        if (data.members[0] === user) {
          data.members.splice(0,1);
        } else {
          data.members.splice(1,1);
        }
        state = state.set(data.members[0], List(data.history.map(h => Map(h))));
      });
      return state.map(h => h.map(m => {
        const likes = m.get('likes');
        m = m.delete('likes');
        return m.set('likes', Set(likes));
      }));

    case INITIALIZE_PRIVATE:
      return state.has(payload) ? state : state.set(payload, List());

    case ADD_MESSAGE_PRIVATE:
      const { reciepient, message } = payload;
      return state.updateIn([reciepient], l => l.push(message));

    case DELETE_MESSAGE_PRIVATE:
      return state.updateIn([payload.reciepient], l =>
        l.filter(message => message.get('id') !== payload.id));

    case EDIT_MESSAGE_PRIVATE:
      return state.updateIn([payload.reciepient], l => {
        return l.map(message => {
          if (message.get('id') === payload.id) {
            return message.set('text', payload.text);
          } else {
            return message;
          }
        });
      });

    case LIKE_MESSAGE_PRIVATE:
      const { messageId, liker } = payload;
      return state.updateIn([payload.reciepient], l => {
        return l.map(message => {
          if (message.get('id') === messageId && !message.get('likes').has(liker)) {
              return message.update('likes', likes => likes.add(liker))
          } else {
            return message;
          }
        });
      });

    case RECEIVED_LIKE_PRIVATE:
    // needs to be updated for private chat
      return state.map(message => {
        if (message.get('id') === payload.messageId) {
          return message.update('likes', likes => likes.add(payload.liker));
        } else {
          return message;
        }
      });

    case RECEIVED_MESSAGE_PRIVATE:
    // needs to be updated for private chat
      return state.push(Map(action.payload));

    case RECEIVED_UPDATE_PRIVATE:
    // needs to be updated for private chat
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
