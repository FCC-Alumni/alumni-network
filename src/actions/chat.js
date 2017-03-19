
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
  const { author, text } = payload;
  const message = Map({
    text,
    author: author.username,
    avatar: author.avatarUrl,
    likes: Set(),
    edited: false,
    timestamp: Date.now(),
    id: (author.username + '_' + uuidV1()),
  });
  socket.emit('submission', message);
  return {
    type: ADD_MESSAGE,
    payload: message
  }
};

export const deleteMessage = (id) => {
  socket.emit('delete-message', id);
  return {
    type: DELETE_MESSAGE,
    payload: { id }
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

export const saveEdit = (id, text) => {
  return {
    type: EDIT_MESSAGE,
    payload: {
      id,
      text
    }
  };
};

export const broadcastEdit = (id) => {
  const message = store.getState().chat.find(d => d.get('id') === id).toJS();
  socket.emit('update-message', message);
  return {
    type: null
  }
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

export const likeMessage = (messageId, liker) => {
  socket.emit('like-message', { messageId, liker });
  return {
    type: LIKE_MESSAGE,
    payload: {
      messageId,
      liker
    }
  }
};
