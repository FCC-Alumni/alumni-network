import { ADD_FLASH_MESSAGE, DELETE_FLASH_MESSAGE, CLEAR_FLASH_MESSAGE } from '../actions/types';
import shortid from 'shortid';
import findIndex from 'lodash/findIndex';

export default (state = [], action) => {
  switch(action.type) {
    case ADD_FLASH_MESSAGE:
      // prevent duplicate messages
      const exists = findIndex(state, { text: action.message.text });
      if (exists >= 0) {
        return state;
      } else {
        return [
          ...state,
          {
            id: shortid.generate(),
            type: action.message.type,
            text: action.message.text
          }
        ];
      }

    case DELETE_FLASH_MESSAGE:
      const index = findIndex(state, { id: action.id });
      if (index >= 0) {
        return [
          ...state.slice(0, index),
          ...state.slice(index + 1)
        ];
      }
      return state;

    case CLEAR_FLASH_MESSAGE:
      return []

    default: return state;
  }
}
