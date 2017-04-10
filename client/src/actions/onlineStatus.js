import { socket } from './chat';
import { store } from '../index';

export const POPULATE_ONLINE_USERS = 'POPULATE_ONLINE_USERS';
export const USER_ONLINE = 'USER_ONLINE';
export const USER_OFFLINE = 'USER_OFFLINE';
export const NEW_USER_JOINED = 'NEW_USER_JOINED';

socket.on('populate-online-users', ({ users }) => {
  store.dispatch({
    type: POPULATE_ONLINE_USERS,
    payload: Object.keys(users)
  });
});

socket.on('new-user-joined', ({ user }) => {
  store.dispatch({
    type: NEW_USER_JOINED,
    payload: user
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
