const { Server } = require('socket.io');

let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // Allow your frontend to connect
      methods: ['GET', 'POST'],
    },
  });

  console.log('Socket.IO server initialized');

  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Listen for a 'join' event from a client
    socket.on('join', (data) => {
      // Create a private room for the user based on their user ID
      socket.join(data.userId);
      console.log(`User ${data.userId} joined their notification room.`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = {
  initSocket,
  getIO,
};