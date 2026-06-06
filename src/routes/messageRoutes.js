const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { upload } = require('../cloudinary');
const {
  sendMessage,
  getMessages,
  getMyChats
} = require('../controllers/messageController');

// Чатҳои ман
router.get('/chats', auth, getMyChats);

// Паёмҳои як чат
router.get('/:orderId', auth, getMessages);

// Паём фиристодан (бо сурат)
router.post('/', auth, upload.single('image'), sendMessage);

module.exports = router;