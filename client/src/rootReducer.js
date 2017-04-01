import { combineReducers } from 'redux';

import user from './reducers/user';
import chat from './reducers/chat';
import search from './reducers/search';
import community from './reducers/community';
import privateChat from './reducers/privateChat';
import onlineStatus from './reducers/onlineStatus';
import flashMessages from './reducers/flashMessages';
import profileViewState from './reducers/profileViewState';

export default combineReducers({
  user,
  chat,
  search,
  community,
  privateChat,
  onlineStatus,
  flashMessages,
  profileViewState
});
