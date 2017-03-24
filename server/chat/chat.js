
import { isAuthenticated } from '../routes/user';

import { client as redis } from '../server.js';
redis.set('chat', JSON.stringify([]));

// send current Redis chat cache to new client
const initalizeClient = (socket, chatHistory) => {
  socket.emit('initalize-chat', JSON.parse(chatHistory));
};

// save a new message
const saveMessage = (message) => {
  redis.get('chat', (err, messages) => {
    const current = JSON.parse(messages);
    const next = current.concat(message);
    redis.set('chat', JSON.stringify(next));
  });
};

// save a message deletion
const registerDelete = (id) => {
  redis.get('chat', (err, messages) => {
    const current = JSON.parse(messages);
    const next = current.filter(message => message.id !== id);
    redis.set('chat', JSON.stringify(next));
  });
};

// save a like event to Redis
const saveLike = (messageId, liker) => {
  redis.get('chat', (err, messages) => {
    const current = JSON.parse(messages);
    const updated = current.map(message => {
      if (message.id === messageId) {
        message.likes.push(liker);
        return message;
      } else {
        return message;
      }
    });
    redis.set('chat', JSON.stringify(updated));
  });
};

// save an edited message to Redis
const saveUpdate = (updatedMessage) => {
  redis.get('chat', (err, messages) => {
    const current = JSON.parse(messages);
    const updated = current.map(message => {
      if (message.id === updatedMessage.id) {
        return updatedMessage;
      } else {
        return message;
      }
    });
    redis.set('chat', JSON.stringify(updated));
  });
};

// socket.io events:
module.exports = (io) => {

  io.on('connection', (socket) => {

    // new client connects, send them the current chat history
    console.log('Socket.io connected');
    redis.get('chat', (err, history) => initalizeClient(socket, history));

    // client submits message
  	socket.on('submission', (data) => {
      saveMessage(data);
      socket.broadcast.emit('broadcast-message', data);
  	});

    // client edits a message
    socket.on('update-message', (data) => {
      saveUpdate(data);
      socket.broadcast.emit('broadcast-update', data);
    });

    // client likes a message
    socket.on('like-message', ({ messageId, liker }) => {
      saveLike(messageId, liker);
      socket.broadcast.emit('broadcast-like', { messageId, liker });
    });

    // client deletes a message
    socket.on('delete-message', id => {
      registerDelete(id);
      socket.broadcast.emit('broadcast-deletion', id);
    });

    socket.on('disconnect', () => console.log('Socket connection closed'));;
  });

};
