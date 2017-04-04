/* eslint-disable */
import { List, Map, Set } from 'immutable';
import {
  POPULATE_PRIVATE,
  INITIALIZE_PRIVATE,
  ADD_MESSAGE_PRIVATE,
  EDIT_MESSAGE_PRIVATE,
  DELETE_MESSAGE_PRIVATE,
  LIKE_MESSAGE_PRIVATE,
  RECEIVED_MESSAGE_PRIVATE,
  RECEIVED_LIKE_PRIVATE,
  RECEIVED_UPDATE_PRIVATE,
  RECEIVED_DELETE_PRIVATE,
  PRIVATE_CHAT_NOTIFY,
  CLEAR_NOTICATIONS
} from '../actions/chat';

/*** private chat default state is a map
 * where keys represent the user being chatted with
 * which map to a single List of chat history ***/

export default (state = Map(), action) => {
  const { type, payload } = action;

  switch (type) {

    case POPULATE_PRIVATE: {
      const { user, data } = payload;
      let recipient;

      if (data.length === 0) return state;

      // we basically need to do some conversions to the data...
      data.map(data => {
        if (data.members[0] === user) {
          data.members.splice(0,1);
        } else {
          data.members.splice(1,1);
        }
        recipient = data.members[0];
        state = state.set(recipient, Map({
          notifications: data.notifications[user],
          history: List(data.history.map(h => Map(h)))
        }));
      });
      return state.updateIn([recipient, 'history'], h => h.map(m => {
        const likes = m.get('likes');
        m = m.delete('likes');
        return m.set('likes', Set(likes));
      }));
    }

    case INITIALIZE_PRIVATE: {
      return state.has(payload) ? state : state.set(payload, Map({
        notifications: 0,
        history: List()
      }));
    }

    case ADD_MESSAGE_PRIVATE: {
      const { recipient, message } = payload;
      return state.updateIn([recipient, 'history'], l => l.push(message));
    }

    case EDIT_MESSAGE_PRIVATE: {
      const { id, text, recipient } = payload;
      return state.updateIn([recipient, 'history'], l => {
        return l.map(message => {
          if (message.get('id') === id) {
            return message.set('text', text).set('edited', true);
          } else {
            return message;
          }
        });
      });
    }

    case LIKE_MESSAGE_PRIVATE: {
      const { messageId, liker, recipient } = payload;
      return state.updateIn([recipient, 'history'], l => {
        return l.map(message => {
          if (message.get('id') === messageId && !message.get('likes').has(liker)) {
              return message.update('likes', likes => likes.add(liker))
          } else {
            return message;
          }
        });
      });
    }

    case DELETE_MESSAGE_PRIVATE: {
      return state.updateIn([payload.recipient, 'history'], l =>
        l.filter(message => message.get('id') !== payload.id));
    }

    // real-time update actions:
    case RECEIVED_MESSAGE_PRIVATE: {
      const { recipient, message } = payload;
      if (state.has(message.author)) {
        return state.updateIn([message.author, 'history'], l => {
          return l.push(Map(message));
        });
      } else { // i.e. if chat history doesn't exist yet:
        return state.set(message.author, Map({
          notifications: 0,
          history: List([Map(message)])
        })).updateIn([message.author, 'history'], h => h.map(m => {
          const likes = m.get('likes');
          m = m.delete('likes');
          return m.set('likes', Set(likes));
        }));
      }
    }

    case RECEIVED_UPDATE_PRIVATE: {
      const { author, recipient, id, text } = payload;
      return state.updateIn([author, 'history'], l => {
        return l.map(message => {
          if (message.get('id') === id) {
            return message
              .set('text', text)
              .set('edited', true);
          } else {
            return message;
          }
        });
      });
    }

    case RECEIVED_LIKE_PRIVATE: {
      const { liker, recipient, id } = payload;
      return state.updateIn([liker, 'history'], l => {
        return l.map(message => {
          if (message.get('id') === id) {
            return message.update('likes', likes => likes.add(liker));
          } else {
            return message;
          }
        });
      });
    }

    case RECEIVED_DELETE_PRIVATE: {
      const { author, recipient, id } = payload;
      return state.updateIn([author, 'history'], l => {
        return l.filter(m => {
          return m.get('id') !== id;
        });
      });
    }

    case PRIVATE_CHAT_NOTIFY: {
      const { recipient } = payload;
      return state.updateIn([recipient, 'notifications'], n => n + 1);
    }

    case CLEAR_NOTICATIONS: {
      const { recipient } = payload;
      return state.updateIn([recipient, 'notifications'], n => 0);
    }

    default: return state;
  }
}
