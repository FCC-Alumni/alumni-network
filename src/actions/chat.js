/* eslint-disable */
import uuidV1 from 'uuid/v1';
import { Map, Set } from 'immutable';
import { store } from '../index.js';

// setup socket.io connection
const DEV_HOST = 'http://localhost:8080';
const PROD_HOST = ''; // production host url
export const socket = require('socket.io-client').connect(DEV_HOST);

export const INITIALIZE = 'INITIALIZE';
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const EDIT_MESSAGE = 'EDIT_MESSAGE';
export const DELETE_MESSAGE = 'DELETE_MESSAGE';
export const LIKE_MESSAGE = 'LIKE_MESSAGE';
export const RECEIVED_LIKE = 'RECEIVED_LIKE';
export const RECEIVED_MESSAGE = 'RECEIVED_MESSAGE';
export const RECEIVED_UPDATE = 'RECEIVED_UPDATE';

export const INITIALIZE_PRIVATE = 'INITIALIZE_PRIVATE';
export const ADD_MESSAGE_PRIVATE = 'ADD_MESSAGE_PRIVATE';
export const EDIT_MESSAGE_PRIVATE = 'EDIT_MESSAGE_PRIVATE';
export const DELETE_MESSAGE_PRIVATE = 'DELETE_MESSAGE_PRIVATE';
export const LIKE_MESSAGE_PRIVATE = 'LIKE_MESSAGE_PRIVATE';
export const RECEIVED_LIKE_PRIVATE = 'RECEIVED_LIKE_PRIVATE';
export const RECEIVED_MESSAGE_PRIVATE = 'RECEIVED_MESSAGE_PRIVATE';
export const RECEIVED_UPDATE_PRIVATE = 'RECEIVED_UPDATE_PRIVATE';

/** PRIVATE CHAT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

export const initiatePrivateChat = (author) => {
  return {
    type: INITIALIZE_PRIVATE,
    payload: author
  }
}

/** ALL CHAT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

socket.on('initalize-chat', (data) => {
  data.forEach(message => message.likes = Set(message.likes));
  store.dispatch({
    type: INITIALIZE,
    payload: data.map(message => Map(message))
  });
});

socket.on('broadcast-message', (message) => {
  message.likes = Set();
  store.dispatch({
    type: RECEIVED_MESSAGE,
    payload: message
  });
});

export const addMessage = (payload) => {
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
    return {
      type: ADD_MESSAGE_PRIVATE,
      payload: {
        message,
        reciepient: conversant
      }
    }
  } else {
    socket.emit('submission', message);
    return {
      type: ADD_MESSAGE,
      payload: message
    }
  }
};

export const deleteMessage = (id, conversant) => {
  if (conversant) {
    return {
      type: DELETE_MESSAGE_PRIVATE,
      payload: {
        id,
        reciepient: conversant
      }
    }
  } else {
    socket.emit('delete-message', id);
    return {
      type: DELETE_MESSAGE,
      payload: { id }
    }
  }
};

socket.on('broadcast-deletion', (id) => {
  store.dispatch({
    type: DELETE_MESSAGE,
    payload: { id }
  });
})

socket.on('broadcast-update', (message) => {
  message.likes = Set(message.likes);
  store.dispatch({
    type: RECEIVED_UPDATE,
    payload: message
  });
});

export const saveEdit = (id, text, conversant) => {
  if (conversant) {
    return {
      type: EDIT_MESSAGE_PRIVATE,
      payload: {
        id,
        text,
        reciepient: conversant
      }
    }
  } else {
    return {
      type: EDIT_MESSAGE,
      payload: {
        id,
        text
      }
    };
  }
};

export const broadcastEdit = (id, conversant) => {
  if (conversant) {
    // private socket action here
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
  })
});

export const likeMessage = (messageId, liker, conversant) => {
  if (conversant) {
    // private socket action here
    return {
      type: LIKE_MESSAGE_PRIVATE,
      payload: {
        messageId,
        liker,
        reciepient: conversant
      }
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
