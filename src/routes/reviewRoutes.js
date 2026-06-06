const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { upload } = require('../cloudinary');
const {
  createReview,
  getWorkerReviews
} = require('../controllers/reviewController');

// Отзыв гузоштан (бо сурат)
router.post('/', auth, upload.single('photo'), createReview);

// Отзывҳои усто
router.get('/:workerId', getWorkerReviews);

module.exports = router;