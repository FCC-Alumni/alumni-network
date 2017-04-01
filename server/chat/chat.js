
/*** we will use Redis to maintain a record of
  currently online users: ***/

// try to initialize redis
if (process.env.REDISTOGO_URL) {
  var HerokuRedis = require("url").parse(process.env.REDISTOGO_URL);
  var redis = require("redis").createClient(HerokuRedis.port, HerokuRedis.hostname);
  redis.auth(HerokuRedis.auth.split(":")[1]);
} else {
  var redis = require("redis").createClient();
}

redis.on('error', (err) => console.log(`Redis Error: ${err}`));
redis.on('ready', () => console.log('Redis connected'));

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
            users[user] = socket.id;
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
      const { reciepient } = data;
      redis.get('online-users', (err, onlineUsers) => {
        if (!err) {
          const users = JSON.parse(onlineUsers);
          if (reciepient in users) {
            socket.broadcast.to(users[reciepient])
              .emit('broadcast-private-submission', data);
          }
        }
      });
    });
    socket.on('private-update', (data) => {
      const { reciepient } = data;
      redis.get('online-users', (err, onlineUsers) => {
        if (!err) {
          const users = JSON.parse(onlineUsers);
          if (reciepient in users) {
            socket.broadcast.to(users[reciepient])
              .emit('broadcast-private-update', data);
          }
        }
      });
    });
    socket.on('private-like', (data) => {
      const { reciepient } = data;
      redis.get('online-users', (err, onlineUsers) => {
        if (!err) {
          const users = JSON.parse(onlineUsers);
          if (reciepient in users) {
            socket.broadcast.to(users[reciepient])
              .emit('broadcast-private-like', data);
          }
        }
      });
    });
    socket.on('private-delete', (data) => {
      const { reciepient } = data;
      redis.get('online-users', (err, onlineUsers) => {
        if (!err) {
          const users = JSON.parse(onlineUsers);
          if (reciepient in users) {
            socket.broadcast.to(users[reciepient])
              .emit('broadcast-private-delete', data);
          }
        }
      });
    });

    socket.on('disconnect', () => {
      redis.get('online-users', (err, data) => {
        if (!err) {
          const users = JSON.parse(data);
          const disconnectedUser = users[socket.id];
          delete users[socket.id];
          delete users[disconnectedUser];
          redis.set('online-users', JSON.stringify(users));
          socket.broadcast.emit('user-offline', { user: disconnectedUser} );
        };
      });
      console.log('Socket connection closed');
    });

  });
};
