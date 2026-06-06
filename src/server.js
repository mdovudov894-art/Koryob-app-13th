const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// MongoDB пайваст кардан
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB пайваст шуд!'))
  .catch((err) => console.log('❌ MongoDB хатогӣ:', err));

// Роутҳо
const authRoutes = require('./routes/authRoutes');
const workerRoutes = require('./routes/workerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const messageRoutes = require('./routes/messageRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);

// Socket.io (барои чати зинда)
io.on('connection', (socket) => {
  console.log('🟢 Корбар пайваст шуд:', socket.id);

  socket.on('joinRoom', (orderId) => {
    socket.join(orderId);
  });

  socket.on('sendMessage', (data) => {
    io.to(data.orderId).emit('receiveMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Корбар қатъ шуд:', socket.id);
  });
});

// Санҷиши сервер
app.get('/api', (req, res) => {
  res.json({ message: '🚀 Сервери Корбор кор мекунад!' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Сервер дар порти ${PORT} кор мекунад`);
});