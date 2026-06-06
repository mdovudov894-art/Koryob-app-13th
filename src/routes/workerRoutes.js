const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { upload } = require('../cloudinary');
const {
  getProfile,
  updateProfile,
  toggleStatus,
  addPortfolio,
  getAllWorkers
} = require('../controllers/workerController');

// Ҳамаи устоҳо (бо филтр)
router.get('/', getAllWorkers);

// Профили худ
router.get('/profile', auth, getProfile);

// Профилро навсозӣ кардан
router.put('/profile', auth, updateProfile);

// Статусро дигар кардан
router.patch('/status', auth, toggleStatus);

// Портфолио илова кардан
router.post('/portfolio', auth, upload.single('image'), addPortfolio);

module.exports = router;