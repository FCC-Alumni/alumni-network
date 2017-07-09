import chat from './reducers/chat';
import { combineReducers } from 'redux';
import community from './reducers/community';
import flashMessages from './reducers/flashMessages';
import onlineStatus from './reducers/onlineStatus';
import privateChat from './reducers/privateChat';
import profileViewState from './reducers/preferencesViewState';
import publicProfileStats from './reducers/publicProfileStats';
import search from './reducers/search';
import user from './reducers/user';

export default combineReducers({
  user,
  chat,
  search,
  community,
  privateChat,
  onlineStatus,
  flashMessages,
  profileViewState,
  publicProfileStats
});
