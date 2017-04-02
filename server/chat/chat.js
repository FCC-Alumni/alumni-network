import PrivateChat from '../models/private-chat';

import redis from 'redis';
import url from 'url';
/*** we will use Redis to maintain a record of
  currently online users: ***/
const herokuRedis = () => {
  const HerokuRedis = url.parse(process.env.REDISTOGO_URL);
  const redisClient = redis.createClient(HerokuRedis.port, HerokuRedis.hostname);
  redisClient.auth(HerokuRedis.auth.split(":")[1]);
  return redisClient;
};

const client = process.env.REDISTOGO_URL ? herokuRedis() : redis.createClient();

client.on('error', (err) => console.log(`Redis Error: ${err}`));
client.on('ready', () => console.log('Redis connected'));

client.set('online-users', JSON.stringify({
  byName: {},
  byID: {}
}));

// all real-time chat events:
module.exports = (io) => {
  io.on('connection', (socket) => {

    console.log('Socket.io connected');

    client.get('online-users', (err, data) => {
      if (!err) {
        const users = JSON.parse(data);
        socket.emit('populate-online-users', { users: users.byName });
      };
    });

    socket.on('user-online', ({ user }) => {
      if (user) {
        client.get('online-users', (err, data) => {
          if (!err) {
            const users = JSON.parse(data);
            users.byID[socket.id] = user;
            users.byName[user] = socket.id;
            client.set('online-users', JSON.stringify(users));
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
      const { author } = data.message;
      client.get('online-users', (err, onlineUsers) => {
        if (!err) {
          const users = JSON.parse(onlineUsers);
          if (reciepient in users.byName) {
            socket.broadcast.to(users.byName[reciepient])
              .emit('broadcast-private-submission', data);
          } else {
            PrivateChat.findOne({ $and: [{members: author}, {members: reciepient}] }, (err, conversation) => {
              if (!err) {
                conversation.notifications[reciepient]++;
                conversation.markModified('notifications');
                conversation.save();
              }
            });
          }
        }
      });
    });
    socket.on('private-update', (data) => {
      const { reciepient } = data;
      client.get('online-users', (err, onlineUsers) => {
        if (!err) {
          const users = JSON.parse(onlineUsers);
          if (reciepient in users.byName) {
            socket.broadcast.to(users.byName[reciepient])
              .emit('broadcast-private-update', data);
          }
        }
      });
    });
    socket.on('private-like', (data) => {
      const { reciepient } = data;
      client.get('online-users', (err, onlineUsers) => {
        if (!err) {
          const users = JSON.parse(onlineUsers);
          if (reciepient in users.byName) {
            socket.broadcast.to(users.byName[reciepient])
              .emit('broadcast-private-like', data);
          }
        }
      });
    });
    socket.on('private-delete', (data) => {
      const { reciepient } = data;
      client.get('online-users', (err, onlineUsers) => {
        if (!err) {
          const users = JSON.parse(onlineUsers);
          if (reciepient in users.byName) {
            socket.broadcast.to(users.byName[reciepient])
              .emit('broadcast-private-delete', data);
          }
        }
      });
    });

    socket.on('disconnect', () => {
      client.get('online-users', (err, data) => {
        if (!err) {
          const users = JSON.parse(data);
          const disconnectedUser = users.byID[socket.id];
          delete users.byID[socket.id];
          delete users.byName[disconnectedUser];
          client.set('online-users', JSON.stringify(users));
          socket.broadcast.emit('user-offline', { user: disconnectedUser} );
        };
      });
      console.log('Socket connection closed');
    });

  });
};
