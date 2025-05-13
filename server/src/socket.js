const socketIo = require('socket.io');
let io;

module.exports = {
  init: (server) => {
    io = socketIo(server, {
      cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    io.on('connection', (socket) => {
      console.log('Client connecté via Socket.IO:', socket.id);
      socket.on('disconnect', () => {
        console.log('Client déconnecté:', socket.id);
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io non initialisé');
    }
    return io;
  },
};