<<<<<<< 0f5c92c7cb73056e3aedd0a775f3d72099ddb2e4
import chat from './reducers/chat';
import { combineReducers } from 'redux';
import community from './reducers/community';
=======
import { combineReducers } from 'redux';

import user from './reducers/user';
import search from './reducers/search';
import community from './reducers/community';;
>>>>>>> remove chat from codebase
import flashMessages from './reducers/flashMessages';
import onlineStatus from './reducers/onlineStatus';
import privateChat from './reducers/privateChat';
import profileViewState from './reducers/preferencesViewState';
import publicProfileStats from './reducers/publicProfileStats';
import search from './reducers/search';
import user from './reducers/user';

export default combineReducers({
<<<<<<< 0f5c92c7cb73056e3aedd0a775f3d72099ddb2e4
  chat,
=======
  user,
  search,
>>>>>>> remove chat from codebase
  community,
  flashMessages,
  onlineStatus,
  privateChat,
  profileViewState,
  publicProfileStats,
  search,
  user,
});
