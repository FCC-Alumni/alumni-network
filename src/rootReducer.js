import { combineReducers } from 'redux';
import user from './reducers/user';
import community from './reducers/community';
import chat from './reducers/chat';
import privateChat from './reducers/privateChat';
import flashMessages from './reducers/flashMessages';

export default combineReducers({
  user,
  chat,
  privateChat,
  community,
  flashMessages
});
