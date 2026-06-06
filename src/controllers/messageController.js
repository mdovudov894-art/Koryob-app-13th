const Message = require('../models/Message');

// Паём фиристодан
exports.sendMessage = async (req, res) => {
  try {
    const { orderId, receiverId, text } = req.body;
    const image = req.file ? req.file.path : '';

    const message = await Message.create({
      order: orderId,
      sender: req.user.id,
      receiver: receiverId,
      text,
      image
    });

    const populated = await message.populate('sender', 'name avatar');

    res.status(201).json({ message: '✅ Паём фиристода шуд!', data: populated });
  } catch (err) {
    res.status(500).json({ message: '❌ Хатогӣ:', error: err.message });
  }
};

// Паёмҳои чатро гирифтан
exports.getMessages = async (req, res) => {
  try {
    const { orderId } = req.params;

    const messages = await Message.find({ order: orderId })
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar')
      .sort({ createdAt: 1 });

    // Паёмҳои нахондашударо хондашуда нишон додан
    await Message.updateMany(
      { order: orderId, receiver: req.user.id, isRead: false },
      { isRead: true }
    );

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: '❌ Хатогӣ:', error: err.message });
  }
};

// Чатҳои ман
exports.getMyChats = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }]
    })
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar')
      .populate('order', 'category status')
      .sort({ createdAt: -1 });

    // Ҳар як чатро як маротиба нишон додан
    const chats = [];
    const seen = new Set();

    for (const msg of messages) {
      const key = msg.order._id.toString();
      if (!seen.has(key)) {
        seen.add(key);
        chats.push(msg);
      }
    }

    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: '❌ Хатогӣ:', error: err.message });
  }
};