import { ADD_FLASH_MESSAGE, CLEAR_FLASH_MESSAGE } from '../actions/types';
import findIndex from 'lodash/findIndex';

export default (state = [], action) => {
  switch(action.type) {

    case ADD_FLASH_MESSAGE:
      // prevent duplicate messages
      const index = findIndex(state, { text: action.message.text });
      if (index >= 0) {
        return state;
      } else {
        return [
          {
            type: action.message.type,
            text: action.message.text
          }
        ];
      }

    case CLEAR_FLASH_MESSAGE:
      return []

    default: return state;
  }
}
