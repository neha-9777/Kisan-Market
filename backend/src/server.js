import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app.js';
import config from './config/env.js';
import { connectDB } from './config/db.js';

async function start() {
  await connectDB();

  const server = http.createServer(app);
  const io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('join', (room) => {
      socket.join(room);
    });

    socket.on('typing', (payload) => {
      socket.to(payload.room).emit('typing', payload);
    });

    socket.on('chat_message', (msg) => {
      // broadcast to room
      if (msg.room) socket.to(msg.room).emit('chat_message', msg);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });

  const port = config.PORT || 5000;
  server.listen(port, () => {
    console.log(`Server running in ${config.NODE_ENV} on port ${port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
