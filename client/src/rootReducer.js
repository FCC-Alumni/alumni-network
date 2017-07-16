import { combineReducers } from 'redux';
import community from './reducers/community';
import flashMessages from './reducers/flashMessages';
import profileViewState from './reducers/preferencesViewState';
import publicProfileStats from './reducers/publicProfileStats';
import search from './reducers/search';
import user from './reducers/user';

export default combineReducers({
  community,
  flashMessages,
  profileViewState,
  publicProfileStats,
  search,
  user,
});
