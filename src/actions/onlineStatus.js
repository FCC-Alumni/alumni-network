import { socket } from './chat';
import { store } from '../index.js';

export const USER_ONLINE = 'USER_ONLINE';
export const USER_OFFLINE = 'USER_OFFLINE';

socket.on('connect', () => socket.emit('user-online', { user: store.getState().user.username }));

socket.on('user-online', ({ user }) => {
  store.dispatch({
    type: USER_ONLINE,
    user
  });
});

socket.on('user-offline', ({ user }) => {
  store.dispatch({
    type: USER_OFFLINE,
    user
  });
});
