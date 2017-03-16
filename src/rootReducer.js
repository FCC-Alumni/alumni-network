import { combineReducers } from 'redux';
import user from './reducers/user';
import chat from './reducers/chat';
import flashMessages from './reducers/flashMessages';

export default combineReducers({
  user,
  chat,
  flashMessages
});
