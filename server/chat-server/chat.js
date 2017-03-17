
import { client as redis } from '../server.js';
redis.set('chat', JSON.stringify([]));

// send current Redis chat cache to new client
const initalizeClient = (socket, chatHistory) => {
  socket.emit('initalize-chat', JSON.parse(chatHistory));
}

// broadcast message to all listeneres
const broadcastMessage = (message) => {
  redis.get('chat', (err, messages) => {
    const current = JSON.parse(messages);
    const next = current.concat(message);
    redis.set('chat', JSON.stringify(next));
  });
}

module.exports = (io) => {

  io.on('connection', (socket) => {

    console.log('Socket connection opened, initalizing new client with current Redis store');
    redis.get('chat', (err, history) => initalizeClient(socket, history));

    // client submits message
  	socket.on('submission', (data) => {
      broadcastMessage(data)
      socket.broadcast.emit('broadcast-message', data);
  	});

    socket.on('disconnect', () => console.log('Socket connection closed'));;
  });

}
