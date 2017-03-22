import { ADD_FLASH_MESSAGE, DELETE_FLASH_MESSAGE, CLEAR_FLASH_MESSAGE } from './types'
import { store } from '../index.js';

export function addFlashMessage(message) {
  setTimeout( _ => store.dispatch({ type: CLEAR_FLASH_MESSAGE }), 45000);
  return {
    type: ADD_FLASH_MESSAGE,
    message
  }
}

export function deleteFlashMessage(id) {
  return {
    type: DELETE_FLASH_MESSAGE,
    id
  }
}

export function clearFlashMessage() {
  return {
    type: CLEAR_FLASH_MESSAGE
  }
}