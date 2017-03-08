import { combineReducers } from 'redux';
import user from './reducers/user';
import flashMessages from './reducers/flashMessages';

export default combineReducers({ 
  user,
  flashMessages
});