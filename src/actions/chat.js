/* eslint-disable */
import axios from 'axios';
import uuidV1 from 'uuid/v1';
import { Map, Set } from 'immutable';
import { store } from '../index.js';
import { addFlashMessage } from './flashMessages';

// setup socket.io connection
const DEV_HOST = 'http://localhost:8080';
const PROD_HOST = ''; // production host url
export const socket = require('socket.io-client').connect(DEV_HOST);

export const PRIVATE_ERROR = 'PRIVATE_ERROR';
export const POPULATE_PRIVATE = 'POPULATE_PRIVATE';
export const INITIALIZE_PRIVATE = 'INITIALIZE_PRIVATE';
export const ADD_MESSAGE_PRIVATE = 'ADD_MESSAGE_PRIVATE';
export const EDIT_MESSAGE_PRIVATE = 'EDIT_MESSAGE_PRIVATE';
export const LIKE_MESSAGE_PRIVATE = 'LIKE_MESSAGE_PRIVATE';
export const DELETE_MESSAGE_PRIVATE = 'DELETE_MESSAGE_PRIVATE';
export const RECEIVED_MESSAGE_PRIVATE = 'RECEIVED_MESSAGE_PRIVATE';
export const RECEIVED_LIKE_PRIVATE = 'RECEIVED_LIKE_PRIVATE';
export const RECEIVED_UPDATE_PRIVATE = 'RECEIVED_UPDATE_PRIVATE';
export const RECEIVED_DELETE_PRIVATE = 'RECEIVED_DELETE_PRIVATE';

export const CHAT_INITIALIZE = 'CHAT_INITIALIZE';
export const CHAT_ADD_MESSAGE = 'CHAT_ADD_MESSAGE';
export const CHAT_EDIT_MESSAGE = 'CHAT_EDIT_MESSAGE';
export const CHAT_LIKE_MESSAGE = 'CHAT_LIKE_MESSAGE';
export const CHAT_DELETE_MESSAGE = 'CHAT_DELETE_MESSAGE';
export const CHAT_RECEIVED_MESSAGE = 'CHAT_RECEIVED_MESSAGE';
export const CHAT_RECEIVED_LIKE = 'CHAT_RECEIVED_LIKE';
export const CHAT_RECEIVED_UPDATE = 'CHAT_RECEIVED_UPDATE';

import { flashError } from './flashMessages';

/** PRIVATE CHAT real-time updates: ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  */

socket.on('broadcast-private-submission', data => {
  console.log('received private message:', data);
  const { reciepient, message } = data;
  const user = store.getState().user.username;
  if (user === reciepient) {
    message.likes = Set(message.likes);
    store.dispatch({
      type: RECEIVED_MESSAGE_PRIVATE,
      payload: {
        message,
        reciepient
      }
    });
  };
});

socket.on('broadcast-private-update', data => {
  console.log('received private update:', data);
  const { author, reciepient, id, text } = data;
  const user = store.getState().user.username;
  if (user === reciepient) {
    store.dispatch({
      type: RECEIVED_UPDATE_PRIVATE,
      payload: {
        id,
        text,
        author,
        reciepient
      }
    });
  }
});

socket.on('broadcast-private-like', data => {
  console.log('received private like:', data);
  const { liker, reciepient, id } = data;
  const user = store.getState().user.username;
  if (user === reciepient) {
    store.dispatch({
      type: RECEIVED_LIKE_PRIVATE,
      payload: {
        id,
        liker,
        reciepient
      }
    });
  }
});

socket.on('broadcast-private-delete', data => {
  console.log('received private delete:', data);
  const { author, reciepient, id } = data;
  const user = store.getState().user.username;
  if (user === reciepient) {
    store.dispatch({
      type: RECEIVED_DELETE_PRIVATE,
      payload: {
        id,
        author,
        reciepient
      }
    });
  }
});

/** PRIVATE CHAT actions: ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

const populatePrivateChat = (user, data) => {
  return {
    type: POPULATE_PRIVATE,
    payload: {
      user,
      data
    }
  }
};

export const fetchPrivateChat = (user) => {
  return dispatch => {
    return axios.get('/api/private-chat/initialize')
      .then(res => {
        dispatch(populatePrivateChat(user, res.data));
      }).catch(err => {
        dispatch(addFlashMessage(flashError('There was an error loading the messages.')));
      });
  }
};

export const initiatePrivateChat = (author) => {
  return {
    type: INITIALIZE_PRIVATE,
    payload: author
  }
};

/** MAIN CHAT real-time updates: ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  */

socket.on('broadcast-message', message => {
  message.likes = Set();
  store.dispatch({
    type: CHAT_RECEIVED_MESSAGE,
    payload: message
  });
});

socket.on('broadcast-update', message => {
  message.likes = Set(message.likes);
  store.dispatch({
    type: CHAT_RECEIVED_UPDATE,
    payload: message
  });
});

socket.on('broadcast-like', ({ messageId, liker }) => {
  store.dispatch({
    type: CHAT_RECEIVED_LIKE,
    payload: {
      liker,
      messageId
    }
  });
});

socket.on('broadcast-deletion', id => {
  store.dispatch({
    type: CHAT_DELETE_MESSAGE,
    payload: { id }
  });
});

export const populateChat = () => {
  return dispatch => {
    return axios.get('/api/chat-history')
      .then(res => {
        dispatch({
          type: CHAT_INITIALIZE,
          payload: res.data.history.map(message => {
            message.likes = Set(message.likes);
            return Map(message);
          })
        });
      }).catch(err => {
        dispatch(addFlashMessage(flashError('There was an error loading chat history.')));
      });
  }
};

/** chat actions: ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  */

export const addMessage = payload => {
  const { author, text, conversant } = payload;
  let message = Map({
    text,
    author: author.username,
    avatar: author.personal.avatarUrl,
    likes: Set(),
    edited: false,
    timestamp: Date.now(),
    id: (author.username + '_' + uuidV1()),
  });
  if (conversant) {
    message = message.set('reciepient', conversant);
    return dispatch => {
      return axios.post('/api/private-chat/add-message', message)
        .then(res => {
          socket.emit('private-submission', { author: message.author, reciepient: conversant, message });
          dispatch({
            type: ADD_MESSAGE_PRIVATE,
            payload: {
              message,
              reciepient: conversant
            }
          });
       }).catch(err => {
         dispatch(addFlashMessage(flashError('Could not add message.')));
       });
    }
  } else {
    return dispatch => {
      return axios.post('/api/chat-add-message', message)
        .then(res => {
          socket.emit('submission', message);
          dispatch({
            type: CHAT_ADD_MESSAGE,
            payload: message
          });
        }).catch(err => {
          dispatch(addFlashMessage(flashError('Could not add message.')));
        });
    }
  }
};

export const saveEdit = (id, text, conversant) => {
  if (!conversant) {
    return {
      type: CHAT_EDIT_MESSAGE,
      payload: {
        id,
        text
      }
    };
  } else {
    return { type: null }
  }
};

export const broadcastEdit = (id, text, conversant, author) => {
  if (conversant) {
    return dispatch => {
      return axios.post('/api/private-chat/edit-message', { id, text, conversant })
        .then(res => {
          socket.emit('private-update', { author, reciepient: conversant, id, text });
          dispatch({
            type: EDIT_MESSAGE_PRIVATE,
            payload: {
              id,
              text,
              reciepient: conversant
            }
          })
        }).catch(err => {
          dispatch(addFlashMessage(flashError('Could not edit message.')));
        });
    }
  } else {
    const message = store.getState().chat.find(m => m.get('id') === id).toJS();
    return dispatch => {
      return axios.post('/api/chat-edit-message', { id, text })
        .then(res => {
          message.text = text;
          socket.emit('update-message', message);
          dispatch(saveEdit(id, text));
        }).catch(err => {
          dispatch(addFlashMessage(flashError('Could not edit message.')));
        });
    }
  }
};

export const likeMessage = (messageId, liker, conversant) => {
  if (conversant) {
    if (liker === conversant) return { type: null };
    return dispatch => {
      return axios.post('/api/private-chat/like-message', { id: messageId, conversant })
        .then(res => {
          socket.emit('private-like', { liker, reciepient: conversant, id: messageId });
          dispatch({
            type: LIKE_MESSAGE_PRIVATE,
              payload: {
                liker,
                messageId,
                reciepient: conversant
              }
            });
        }).catch(err => {
          dispatch(addFlashMessage(flashError('Could not submit the like to the server right now.')));
        });
    }
  } else {
    return dispatch => {
      return axios.post('/api/chat-like-message', { id: messageId, liker })
        .then(res => {
          socket.emit('like-message', { messageId, liker });
          dispatch({
            type: CHAT_LIKE_MESSAGE,
            payload: {
              liker,
              messageId
            }
          });
        }).catch(err => {
          dipsatch(addFlashMessage(flashError('Could not like message.')));
        });
    }
  }
};

export const deleteMessage = (id, conversant, author) => {
  if (conversant) {
    return dispatch => {
      return axios.post('/api/private-chat/delete-message', { id, conversant })
        .then(res => {
          socket.emit('private-delete', { author, reciepient: conversant, id });
          dispatch({
            type: DELETE_MESSAGE_PRIVATE,
            payload: {
              id,
              reciepient: conversant
            }
          });
        }).catch(err => {
          dispatch(addFlashMessage(flashError('Message could not be deleted.')));
        });
      }
  } else {
    return dispatch => {
      return axios.post('/api/chat-delete-message', id)
        .then(res => {
          socket.emit('delete-message', id);
          dispatch({
            type: CHAT_DELETE_MESSAGE,
            payload: { id }
          });
        }).catch(err => {
          dispatch(addFlashMessage(flashError('Message could not be deleted.')));
        });
    }
  }
};
