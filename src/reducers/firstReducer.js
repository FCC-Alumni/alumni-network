import DUMMY_CASE from '../actions/types.js';

export default (state = [], action = {}) => {
  switch (action.type) {
    
    case DUMMY_CASE: 
      return [];
      
    default: return state;
  }
}