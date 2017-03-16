
import { store } from '../index.js';

// setup socketio connection
const DEV_HOST = 'http://localhost:8080';
const PROD_HOST = ''; // production host url
export const socket = require('socket.io-client').connect(DEV_HOST);

export const NEW_MESSAGE = 'NEW_MESSAGE';

socket.on('new-message', (data) => {
  store.dispatch({
    type: NEW_MESSAGE,
    data
  });
});
