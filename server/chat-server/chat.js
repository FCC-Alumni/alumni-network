export default (io) => {

  io.on('connection', (socket) => {
  	// inital connection of any client
    console.log('New Socket.io connection opened');

  	socket.on('publish', (data) => {
      console.log('A new message received: ', data);
      io.emit('new-message', data);
  	});

    // handle other events...
    socket.on('disconnect', () => console.log('Socket.io connection closed'));
  });

}
