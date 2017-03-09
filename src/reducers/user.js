import { SAVE_USER } from '../actions/types';

export default (state = [], action = {}) => {
  switch (action.type) {
    
    case SAVE_USER: 
      return [
        action.user
      ];
      
    default: return state;
  }
}