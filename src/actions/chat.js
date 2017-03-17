
import uuidV1 from 'uuid/v1';
import { Map } from 'immutable';
import { store } from '../index.js';

// setup socket.io connection
const DEV_HOST = 'http://localhost:8080';
const PROD_HOST = ''; // production host url
export const socket = require('socket.io-client').connect(DEV_HOST);

export const INITIALIZE = 'INITIALIZE';
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const EDIT_MESSAGE = 'EDIT_MESSAGE';
export const LIKE_MESSAGE = 'LIKE_MESSAGE';
export const RECEIVED_MESSAGE = 'RECEIVED_MESSAGE';
export const RECEIVED_UPDATE = 'RECEIVED_UPDATE';

socket.on('initalize-chat', (payload) => {
  store.dispatch({
    type: INITIALIZE,
    payload: payload.map(message => Map(message))
  });
});

socket.on('broadcast-message', (payload) => {
  store.dispatch({
    type: RECEIVED_MESSAGE,
    payload
  });
});

export const addMessage = (payload) => {
  const { author, text } = payload;
  const message = Map({
    text,
    author: author.username,
    avatar: author.avatarUrl,
    likes: 0,
    edited: false,
    timestamp: Date.now(),
    id: `${author.username}_${uuidV1()}`,
  });
  socket.emit('submission', message);
  return {
    type: ADD_MESSAGE,
    payload: message
  }
}
