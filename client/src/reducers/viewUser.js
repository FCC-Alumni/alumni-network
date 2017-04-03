import { VIEW_THIS_USER } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {

    case VIEW_THIS_USER:
      return action.user;

    default: return state;
  }
}
