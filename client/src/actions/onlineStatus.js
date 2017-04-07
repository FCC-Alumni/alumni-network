import { socket } from './chat';
import { store } from '../index';

export const POPULATE_ONLINE_USERS = 'POPULATE_ONLINE_USERS';
export const USER_ONLINE = 'USER_ONLINE';
export const USER_OFFLINE = 'USER_OFFLINE';

socket.on('connect', () => socket.emit('user-online', { user: store.getState().user.username }));

socket.on('populate-online-users', ({ users }) => {
  store.dispatch({
    type: POPULATE_ONLINE_USERS,
    payload: Object.keys(users)
  });
});

socket.on('user-online', ({ user }) => {
  store.dispatch({
    type: USER_ONLINE,
    payload: user
  });
});

socket.on('user-offline', ({ user }) => {
  store.dispatch({
    type: USER_OFFLINE,
    payload: user
  });
});
