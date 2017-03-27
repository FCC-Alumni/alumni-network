
/*** we will use Redis to maintain a record of
  currently online users: ***/
import { client as redis } from '../server.js';
redis.set('online-users', JSON.stringify({}));

// all real-time chat events:
module.exports = (io) => {
  io.on('connection', (socket) => {

    console.log('Socket.io connected');

    socket.on('user-online', ({ user }) => {
      if (user) {
        redis.get('online-users', (err, data) => {
          if (!err) {
            const users = JSON.parse(data);
            users[socket.id] = user;
            redis.set('online-users', JSON.stringify(users));
            socket.broadcast.emit('user-online', { user });
          }
        });
      }
    });

    // global chat:
  	socket.on('submission', (data) => {
      socket.broadcast.emit('broadcast-message', data);
    });
    socket.on('update-message', (data) => {
      socket.broadcast.emit('broadcast-update', data);
    });
    socket.on('like-message', ({ messageId, liker }) => {
      socket.broadcast.emit('broadcast-like', { messageId, liker });
    });
    socket.on('delete-message', id => {
      socket.broadcast.emit('broadcast-deletion', id);
    });

    // private chat:
    socket.on('private-submission', (data) => {
      socket.broadcast.emit('broadcast-private-submission', data);
    });
    socket.on('private-update', (data) => {
      socket.broadcast.emit('broadcast-private-update', data);
    });
    socket.on('private-like', (data) => {
      socket.broadcast.emit('broadcast-private-like', data);
    });
    socket.on('private-delete', (data) => {
      socket.broadcast.emit('broadcast-private-delete', data);
    });

    socket.on('disconnect', () => {
      redis.get('online-users', (err, data) => {
        if (!err) {
          const users = JSON.parse(data);
          const disconnectedUser = users[socket.id];
          delete users[socket.id];
          redis.set('online-users', JSON.stringify(users));
          socket.broadcast.emit('user-offline', { user: disconnectedUser} );
        };
      });
      console.log('Socket connection closed');
    });

  });
};
