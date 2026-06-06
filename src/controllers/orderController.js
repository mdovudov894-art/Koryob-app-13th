const Order = require('../models/Order');

// Фармоиш сохтан
exports.createOrder = async (req, res) => {
  try {
    const { category, description, address, deadline, budget } = req.body;
    const images = req.files ? req.files.map(f => f.path) : [];

    const order = await Order.create({
      customer: req.user.id,
      category,
      description,
      address,
      deadline,
      budget,
      images
    });

    res.status(201).json({ message: '✅ Фармоиш эълон шуд!', order });
  } catch (err) {
    res.status(500).json({ message: '❌ Хатогӣ:', error: err.message });
  }
};

// Ҳамаи фармоишҳо (барои устоҳо, бо филтр)
exports.getAllOrders = async (req, res) => {
  try {
    const { category, region } = req.query;
    let filter = { status: 'Актив' };
    if (category) filter.category = category;

    const orders = await Order.find(filter)
      .populate('customer', 'name phone region avatar')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: '❌ Хатогӣ:', error: err.message });
  }
};

// Фармоишҳои фармоишгар
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .populate('assignedWorker', 'name phone avatar')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: '❌ Хатогӣ:', error: err.message });
  }
};

// Як фармоишро гирифтан
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name phone region avatar')
      .populate('assignedWorker', 'name phone avatar')
      .populate('responses.worker', 'name phone avatar');

    if (!order) {
      return res.status(404).json({ message: '❌ Фармоиш ёфт нашуд!' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: '❌ Хатогӣ:', error: err.message });
  }
};

// Отклик фиристодан
exports.respondToOrder = async (req, res) => {
  try {
    const { price, deadline, message } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: '❌ Фармоиш ёфт нашуд!' });
    }

    const alreadyResponded = order.responses.find(
      r => r.worker.toString() === req.user.id
    );
    if (alreadyResponded) {
      return res.status(400).json({ message: '❌ Шумо аллакай отклик фиристодед!' });
    }

    order.responses.push({ worker: req.user.id, price, deadline, message });
    await order.save();

    res.json({ message: '✅ Отклик фиристода шуд!' });
  } catch (err) {
    res.status(500).json({ message: '❌ Хатогӣ:', error: err.message });
  }
};

// Усторо тасдиқ кардан
exports.assignWorker = async (req, res) => {
  try {
    const { workerId } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: '❌ Фармоиш ёфт нашуд!' });
    }

    if (order.customer.toString() !== req.user.id) {
      return res.status(403).json({ message: '❌ Иҷозат нест!' });
    }

    order.assignedWorker = workerId;
    await order.save();

    res.json({ message: '✅ Усто тасдиқ шуд!', order });
  } catch (err) {
    res.status(500).json({ message: '❌ Хатогӣ:', error: err.message });
  }
};

// Фармоишро пӯшидан
exports.closeOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: '❌ Фармоиш ёфт нашуд!' });
    }

    if (order.customer.toString() !== req.user.id) {
      return res.status(403).json({ message: '❌ Иҷозат нест!' });
    }

    order.status = 'Иҷрошуда';
    await order.save();

    res.json({ message: '✅ Фармоиш иҷрошуда нишон дода шуд!', order });
  } catch (err) {
    res.status(500).json({ message: '❌ Хатогӣ:', error: err.message });
  }
};