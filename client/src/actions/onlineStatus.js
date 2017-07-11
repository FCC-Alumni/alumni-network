import { socket } from './chat';
import { store } from '../index';

export const POPULATE_ONLINE_USERS = 'POPULATE_ONLINE_USERS';
export const USER_ONLINE = 'USER_ONLINE';
export const USER_OFFLINE = 'USER_OFFLINE';
export const NEW_USER_JOINED = 'NEW_USER_JOINED';

socket.on('populate-online-users', ({ users }) => {
  store.dispatch({
    payload: Object.keys(users),
    type: POPULATE_ONLINE_USERS,
  });
});

socket.on('new-user-joined', ({ user }) => {
  store.dispatch({
    payload: user,
    type: NEW_USER_JOINED,
  });
});

socket.on('user-online', ({ user }) => {
  store.dispatch({
    payload: user,
    type: USER_ONLINE,
  });
});

socket.on('user-offline', ({ user }) => {
  store.dispatch({
    payload: user,
    type: USER_OFFLINE,
  });
});
