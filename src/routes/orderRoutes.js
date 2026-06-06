const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { upload } = require('../cloudinary');
const {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  respondToOrder,
  assignWorker,
  closeOrder
} = require('../controllers/orderController');

// Ҳамаи фармоишҳо (барои устоҳо)
router.get('/', auth, getAllOrders);

// Фармоишҳои ман (барои фармоишгарон)
router.get('/my', auth, getMyOrders);

// Як фармоиш
router.get('/:id', auth, getOrderById);

// Фармоиш сохтан (бо суратҳо)
router.post('/', auth, upload.array('images', 5), createOrder);

// Отклик фиристодан
router.post('/:id/respond', auth, respondToOrder);

// Усторо тасдиқ кардан
router.patch('/:id/assign', auth, assignWorker);

// Фармоишро пӯшидан
router.patch('/:id/close', auth, closeOrder);

module.exports = router;