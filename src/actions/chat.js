/* eslint-disable */
import axios from 'axios';
import uuidV1 from 'uuid/v1';
import { Map, Set } from 'immutable';
import { store } from '../index.js';
import { addFlashMessage } from './flashMessages';

// setup socket.io connection
const DEV_HOST = 'http://localhost:8080';
const PROD_HOST = ''; // production host url
export const socket = require('socket.io-client').connect(DEV_HOST);

export const INITIALIZE = 'INITIALIZE';
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const EDIT_MESSAGE = 'EDIT_MESSAGE';
export const LIKE_MESSAGE = 'LIKE_MESSAGE';
export const DELETE_MESSAGE = 'DELETE_MESSAGE';
export const RECEIVED_MESSAGE = 'RECEIVED_MESSAGE';
export const RECEIVED_LIKE = 'RECEIVED_LIKE';
export const RECEIVED_UPDATE = 'RECEIVED_UPDATE';

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

/** PRIVATE CHAT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

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
        dispatch(addFlashMessage('There was an error loading the messages.'))
      });
  }
};

export const initiatePrivateChat = (author) => {
  return {
    type: INITIALIZE_PRIVATE,
    payload: author
  }
};

socket.on('broadcast-private-submission', data => {
  console.log('received private message:', data);
  const { author, reciepient, message } = data;
  const user = store.getState().user.username;
  if (user === reciepient) {
    message.likes = Set();
    store.dispatch({
      type: RECEIVED_MESSAGE_PRIVATE,
      payload: {
        author,
        reciepient,
        message
      }
    });
  };
});

socket.on('broadcast-private-update', data => {
  console.log('received private update:', data);
  const { author, reciepient, id, text } = data;
  const user = store.getState().user.username;
  if (user === reciepient) {
    store.dispatch({
      type: RECEIVED_UPDATE_PRIVATE,
      payload: {
        author,
        reciepient,
        id,
        text
      }
    });
  }
});

socket.on('broadcast-private-like', data => {
  console.log('received private like:', data);
  const { liker, reciepient, id } = data;
  const user = store.getState().user.username;
  if (user === reciepient) {
    store.dispatch({
      type: RECEIVED_LIKE_PRIVATE,
      payload: {
        liker,
        reciepient,
        id,
      }
    });
  }
});

socket.on('broadcast-private-delete', data => {
  console.log('received private delete:', data);
  const { author, reciepient, id } = data;
  const user = store.getState().user.username;
  if (user === reciepient) {
    store.dispatch({
      type: RECEIVED_DELETE_PRIVATE,
      payload: {
        author,
        reciepient,
        id,
      }
    });
  }
});

/** ALL CHAT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

socket.on('initalize-chat', (data) => {
  data.forEach(message => message.likes = Set(message.likes));
  store.dispatch({
    type: INITIALIZE,
    payload: data.map(message => Map(message))
  });
});

socket.on('broadcast-message', message => {
  message.likes = Set();
  store.dispatch({
    type: RECEIVED_MESSAGE,
    payload: message
  });
});

export const addMessage = payload => {
  const { author, text, conversant } = payload;
  let message = Map({
    text,
    author: author.username,
    avatar: author.avatarUrl,
    likes: Set(),
    edited: false,
    timestamp: Date.now(),
    id: (author.username + '_' + uuidV1()),
  });
  if (conversant) {
    message = message.set('reciepient', conversant);
    return dispatch => {
      return axios.post('/api/private-chat/add-message', message)
        .then(res => {
          socket.emit('private-submission', { author: message.author, reciepient: conversant, message });
          dispatch({
            type: ADD_MESSAGE_PRIVATE,
            payload: {
              message,
              reciepient: conversant
            }
          });
       }).catch(err => {
         dispatch(addFlashMessage('Could not add message.'));
       });
    }
  } else {
    socket.emit('submission', message);
    return {
      type: ADD_MESSAGE,
      payload: message
    }
  }
};

socket.on('broadcast-update', message => {
  message.likes = Set(message.likes);
  store.dispatch({
    type: RECEIVED_UPDATE,
    payload: message
  });
});

export const saveEdit = (id, text, conversant) => {
  if (!conversant) {
    return {
      type: EDIT_MESSAGE,
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
          socket.emit('private-update', { author, reciepient: conversant, id, text });
          dispatch({
            type: EDIT_MESSAGE_PRIVATE,
            payload: {
              id,
              text,
              reciepient: conversant
            }
          })
        }).catch(err => {
          dispatch(addFlashMessage('Could not edit message.'))
        });
    }
  } else {
    const message = store.getState().chat.find(d => d.get('id') === id).toJS();
    socket.emit('update-message', message);
  }
  return { type: null }
};

socket.on('broadcast-like', ({ messageId, liker }) => {
  store.dispatch({
    type: RECEIVED_LIKE,
    payload: {
      messageId,
      liker
    }
  });
});

export const likeMessage = (messageId, liker, conversant) => {
  if (conversant) {
    if (liker === conversant) return { type: null };
    return dispatch => {
      return axios.post('/api/private-chat/like-message', { id: messageId, conversant })
        .then(res => {
          socket.emit('private-like', { liker, reciepient: conversant, id: messageId });
          dispatch({
            type: LIKE_MESSAGE_PRIVATE,
              payload: {
                messageId,
                liker,
                reciepient: conversant
              }
            });
        }).catch(err => {
          dispatch(addFlashMessage('Could not submit the like to the server right now.'));
        });
    }
  } else {
    socket.emit('like-message', { messageId, liker });
    return {
      type: LIKE_MESSAGE,
      payload: {
        messageId,
        liker
      }
    }
  }
};

export const deleteMessage = (id, conversant, author) => {
  if (conversant) {
    return dispatch => {
      return axios.post('/api/private-chat/delete-message', { id, conversant })
        .then(res => {
          socket.emit('private-delete', { author, reciepient: conversant, id });
          dispatch({
            type: DELETE_MESSAGE_PRIVATE,
            payload: {
              id,
              reciepient: conversant
            }
          });
        }).catch(err => {
          dispatch(addFlashMessage('Message could not be deleted.'));
        });
      }
  } else {
    socket.emit('delete-message', id);
    return {
      type: DELETE_MESSAGE,
      payload: { id }
    }
  }
};

socket.on('broadcast-deletion', id => {
  store.dispatch({
    type: DELETE_MESSAGE,
    payload: { id }
  });
});
