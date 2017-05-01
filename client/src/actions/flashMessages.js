export const ADD_FLASH_MESSAGE = 'ADD_FLASH_MESSAGE';
export const CLEAR_FLASH_MESSAGE = 'CLEAR_FLASH_MESSAGE';

export function addFlashMessage(message) {
  return {
    type: ADD_FLASH_MESSAGE,
    message
  }
}

export function clearFlashMessage() {
  return {
    type: CLEAR_FLASH_MESSAGE
  }
}

// helper to generate errors:
export const flashError = (message) => {
  return {
    type: 'error',
    text: {
      header: 'There was a problem...',
      message
    }
  };
}
