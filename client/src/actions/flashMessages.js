export const ADD_FLASH_MESSAGE = 'ADD_FLASH_MESSAGE';
export const CLEAR_FLASH_MESSAGE = 'CLEAR_FLASH_MESSAGE';

export const addFlashMessage = message => {
  return {
    message,
    type: ADD_FLASH_MESSAGE
  }
}

export const clearFlashMessage = () => {
  return {
    type: CLEAR_FLASH_MESSAGE
  }
}

// helper to generate errors:
export const flashError = message => {
  return {
    text: {
      header: 'There was a problem...',
      message
    },
    type: 'error'
  };
}
