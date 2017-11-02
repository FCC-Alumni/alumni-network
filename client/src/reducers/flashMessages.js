import { findIndex } from 'lodash';
import {
  ADD_FLASH_MESSAGE,
  CLEAR_FLASH_MESSAGE
} from '../actions/flashMessages';

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
            text: action.message.text,
            type: action.message.type,
          }
        ];
      }

    case CLEAR_FLASH_MESSAGE:
      return []

    default:
      return state;
  }
}
