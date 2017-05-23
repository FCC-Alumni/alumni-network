/* eslint-disable */
import axios from 'axios';
import uuidV1 from 'uuid/v1';
import { Map, Set } from 'immutable';
import { store } from '../index';
import { addFlashMessage } from './flashMessages';

// define hosts
const DEV_HOST = 'http://localhost:8080';
const PROD_HOST = 'https://beta-fcc-alumni.herokuapp.com';
export const APP_HOST = process.env.NODE_ENV === 'production' ? PROD_HOST : DEV_HOST;

// setup socket.io connection
export const socket = require('socket.io-client').connect(`${APP_HOST}/`);

export const PRIVATE_ERROR = 'PRIVATE_ERROR';
export const POPULATE_PRIVATE = 'POPULATE_PRIVATE';
export const INITIALIZE_PRIVATE = 'INITIALIZE_PRIVATE';
export const ADD_MESSAGE_PRIVATE = 'ADD_MESSAGE_PRIVATE';
export const EDIT_MESSAGE_PRIVATE = 'EDIT_MESSAGE_PRIVATE';
export const LIKE_MESSAGE_PRIVATE = 'LIKE_MESSAGE_PRIVATE';
export const DELETE_MESSAGE_PRIVATE = 'DELETE_MESSAGE_PRIVATE';
export const RECEIVED_MESSAGE_PRIVATE = 'RECEIVED_MESSAGE_PRIVATE';
export const RECEIVED_LIKE_PRIVATE = 'RECEIVED_LIKE_PRIVATE';
export const RECEIVED_UPDATE_PRIVATE = 'RECEIVED_UPDATE_PRIVATE';
export const RECEIVED_DELETE_PRIVATE = 'RECEIVED_DELETE_PRIVATE';
export const PRIVATE_CHAT_NOTIFY = 'PRIVATE_CHAT_NOTIFY';
export const CLEAR_NOTICATIONS = 'CLEAR_NOTICATIONS';

export const CHAT_INITIALIZE = 'CHAT_INITIALIZE';
export const CHAT_ADD_MESSAGE = 'CHAT_ADD_MESSAGE';
export const CHAT_EDIT_MESSAGE = 'CHAT_EDIT_MESSAGE';
export const CHAT_LIKE_MESSAGE = 'CHAT_LIKE_MESSAGE';
export const CHAT_DELETE_MESSAGE = 'CHAT_DELETE_MESSAGE';
export const CHAT_RECEIVED_MESSAGE = 'CHAT_RECEIVED_MESSAGE';
export const CHAT_RECEIVED_LIKE = 'CHAT_RECEIVED_LIKE';
export const CHAT_RECEIVED_UPDATE = 'CHAT_RECEIVED_UPDATE';

import { flashError } from './flashMessages';

/* NOTE: How chat works:

 * There is a common pattern to all of the CRUD actions for chat. Basically,
 * the database is our single source of truth. For any CRUD action, we POST
 * to a route which handles that action (e.g. /api/chat-add-message). If and
 * only if we get a successful response from the server (indicating the database
 * is up to date with that action), we then broadcast a real-time update via
 * socketIO and dispatch an action which performs an update to local UI through
 * Redux. In this way, we only show an update to any user if we have actually
 * updated the data in the database first.

 * On the backend, we have Express routes to handle these CRUD updates in
 * the routes/ directory. Separately, the real time updates are handled in
 * chat/ directory. The real time updates use Redis to store a cache of currently
 * online users (using their socket connection ID) so we can broadcast updates
 * to them only if they are online (and broadcast the update to them and no one
 * else). Then, each connected user listens for socketIO updates in this file to
 * handle the actions appropriately.

 * Finally, most of the CRUD actions below are shared between global and private-chat
 * chat. Basically, whatever calls the action provides a reciepient argument
 * if the chat is private, and this is used to split the action logic appropriately.

 * We use immutableJS data structures to persist our chat data on the client. This means
 * there is some 'serialization/deserialization' logic that takes place when we are
 * saving data to the Redux store.

*/

/** PRIVATE CHAT real-time updates: ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  */

socket.on('broadcast-private-submission', data => {
  console.log('received private message:', data);

  const { recipient, message } = data;
  // if user is not in private chat window, add a notification for them:
  if (!window.location.href.includes(message.author)) {
    axios.post('/api/private-chat/add-notification', { author: message.author, recipient })
    .then(res => {
      store.dispatch({
        type: PRIVATE_CHAT_NOTIFY,
        payload: {
          recipient: message.author
        }
      });
    }).catch(err => {
      dispatch(addFlashMessage(flashError('There was an error saving a new notification.')));
    });
  }

  const user = store.getState().user.username;
  if (user === recipient) {
    message.likes = Set(message.likes);
    store.dispatch({
      type: RECEIVED_MESSAGE_PRIVATE,
      payload: {
        message,
        recipient
      }
    });
  };
});

socket.on('broadcast-private-update', data => {
  console.log('received private update:', data);
  const { author, recipient, id, text } = data;
  const user = store.getState().user.username;
  if (user === recipient) {
    store.dispatch({
      type: RECEIVED_UPDATE_PRIVATE,
      payload: {
        id,
        text,
        author,
        recipient
      }
    });
  }
});

socket.on('broadcast-private-like', data => {
  console.log('received private like:', data);
  const { liker, recipient, id } = data;
  const user = store.getState().user.username;
  if (user === recipient) {
    store.dispatch({
      type: RECEIVED_LIKE_PRIVATE,
      payload: {
        id,
        liker,
        recipient
      }
    });
  }
});

socket.on('broadcast-private-delete', data => {
  console.log('received private delete:', data);
  const { author, recipient, id } = data;
  const user = store.getState().user.username;
  if (user === recipient) {
    store.dispatch({
      type: RECEIVED_DELETE_PRIVATE,
      payload: {
        id,
        author,
        recipient
      }
    });
  }
});

/** PRIVATE CHAT actions: ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

const populatePrivateChat = (user, data) => {
  return {
    type: POPULATE_PRIVATE,
    payload: {
      user,
      data
    }
  }
};

export const fetchPrivateChat = (user) => {
  return dispatch => {
    return axios.get('/api/private-chat/initialize')
      .then(res => {
        dispatch(populatePrivateChat(user, res.data));
      }).catch(err => {
        dispatch(addFlashMessage(flashError('There was an error loading the messages.')));
      });
  }
};

export const initiatePrivateChat = (author) => {
  return {
    type: INITIALIZE_PRIVATE,
    payload: author
  }
};

export const clearNotifications = (data) => {
  return dispatch => {
    return axios.post('/api/private-chat/clear-notifications', data)
      .then(res => {
        dispatch({
          type: CLEAR_NOTICATIONS,
          payload: {
            recipient: data.recipient
          }
        });
      }).catch(err => {
        dispatch(addFlashMessage(flashError('There was an error updating the notifications.')));
      });
  }
}

/** MAIN CHAT real-time updates: ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  */

socket.on('broadcast-message', message => {
  message.likes = Set();
  store.dispatch({
    type: CHAT_RECEIVED_MESSAGE,
    payload: message
  });
});

socket.on('broadcast-update', message => {
  message.likes = Set(message.likes);
  store.dispatch({
    type: CHAT_RECEIVED_UPDATE,
    payload: message
  });
});

socket.on('broadcast-like', ({ messageId, liker }) => {
  store.dispatch({
    type: CHAT_RECEIVED_LIKE,
    payload: {
      liker,
      messageId
    }
  });
});

socket.on('broadcast-deletion', id => {
  store.dispatch({
    type: CHAT_DELETE_MESSAGE,
    payload: { id }
  });
});

export const populateChat = () => {
  return dispatch => {
    return axios.get('/api/chat-history')
      .then(res => {
        dispatch({
          type: CHAT_INITIALIZE,
          payload: res.data.map(message => {
            message.likes = Set(message.likes);
            return Map(message);
          })
        });
      }).catch(err => {
        dispatch(addFlashMessage(flashError('There was an error loading chat history.')));
      });
  }
};

/** chat actions: ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  */

export const addMessage = payload => {
  const { author, text, conversant } = payload;
  let message = Map({
    text,
    author: author.username,
    avatar: author.personal.avatarUrl,
    likes: Set(),
    edited: false,
    timestamp: Date.now(),
    id: (author.username + '_' + uuidV1()),
  });
  if (conversant) {
    message = message.set('recipient', conversant);
    return dispatch => {
      return axios.post('/api/private-chat/add-message', message)
        .then(res => {
          socket.emit('private-submission', { author: message.author, recipient: conversant, message });
          dispatch({
            type: ADD_MESSAGE_PRIVATE,
            payload: {
              message,
              recipient: conversant
            }
          });
       }).catch(err => {
         dispatch(addFlashMessage(flashError('Could not add message.')));
       });
    }
  } else {
    return dispatch => {
      return axios.post('/api/chat-add-message', message)
        .then(res => {
          socket.emit('submission', message);
          dispatch({
            type: CHAT_ADD_MESSAGE,
            payload: message
          });
        }).catch(err => {
          dispatch(addFlashMessage(flashError('Could not add message.')));
        });
    }
  }
};

export const saveEdit = (id, text, conversant) => {
  if (!conversant) {
    return {
      type: CHAT_EDIT_MESSAGE,
      payload: {
        id,
        text
      }
    };
  } else {
    return { type: null }
  }
};

export const broadcastEdit = (id, text, conversant, author) => {
  if (conversant) {
    return dispatch => {
      return axios.post('/api/private-chat/edit-message', { id, text, conversant })
        .then(res => {
          socket.emit('private-update', { author, recipient: conversant, id, text });
          dispatch({
            type: EDIT_MESSAGE_PRIVATE,
            payload: {
              id,
              text,
              recipient: conversant
            }
          })
        }).catch(err => {
          dispatch(addFlashMessage(flashError('Could not edit message.')));
        });
    }
  } else {
    const message = store.getState().chat.find(m => m.get('id') === id).toJS();
    return dispatch => {
      return axios.post('/api/chat-edit-message', { id, text })
        .then(res => {
          message.text = text;
          socket.emit('update-message', message);
          dispatch(saveEdit(id, text));
        }).catch(err => {
          dispatch(addFlashMessage(flashError('Could not edit message.')));
        });
    }
  }
};

export const likeMessage = (messageId, liker, conversant) => {
  if (conversant) {
    if (liker === conversant) return { type: null };
    return dispatch => {
      return axios.post('/api/private-chat/like-message', { id: messageId, conversant })
        .then(res => {
          socket.emit('private-like', { liker, recipient: conversant, id: messageId });
          dispatch({
            type: LIKE_MESSAGE_PRIVATE,
              payload: {
                liker,
                messageId,
                recipient: conversant
              }
            });
        }).catch(err => {
          dispatch(addFlashMessage(flashError('Could not submit the like to the server right now.')));
        });
    }
  } else {
    return dispatch => {
      return axios.post('/api/chat-like-message', { id: messageId, liker })
        .then(res => {
          socket.emit('like-message', { messageId, liker });
          dispatch({
            type: CHAT_LIKE_MESSAGE,
            payload: {
              liker,
              messageId
            }
          });
        }).catch(err => {
          dipsatch(addFlashMessage(flashError('Could not like message.')));
        });
    }
  }
};

export const deleteMessage = (id, conversant, author) => {
  if (conversant) {
    return dispatch => {
      return axios.post('/api/private-chat/delete-message', { id, conversant })
        .then(res => {
          socket.emit('private-delete', { author, recipient: conversant, id });
          dispatch({
            type: DELETE_MESSAGE_PRIVATE,
            payload: {
              id,
              recipient: conversant
            }
          });
        }).catch(err => {
          dispatch(addFlashMessage(flashError('Message could not be deleted.')));
        });
      }
  } else {
    return dispatch => {
      return axios.post('/api/chat-delete-message', { id })
        .then(res => {
          socket.emit('delete-message', id);
          dispatch({
            type: CHAT_DELETE_MESSAGE,
            payload: { id }
          });
        }).catch(err => {
          dispatch(addFlashMessage(flashError('Message could not be deleted.')));
        });
    }
  }
};
