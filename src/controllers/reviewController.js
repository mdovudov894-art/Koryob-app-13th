const Review = require('../models/Review');
const WorkerProfile = require('../models/WorkerProfile');

// Отзыв гузоштан
exports.createReview = async (req, res) => {
  try {
    const { workerId, orderId, stars, comment } = req.body;
    const photo = req.file ? req.file.path : '';

    const existing = await Review.findOne({
      customer: req.user.id,
      order: orderId
    });

    if (existing) {
      return res.status(400).json({ message: '❌ Шумо ба ин фармоиш аллакай баҳо додед!' });
    }

    const review = await Review.create({
      customer: req.user.id,
      worker: workerId,
      order: orderId,
      stars,
      comment,
      photo
    });

    // Рейтинги усторо навсозӣ кардан
    const allReviews = await Review.find({ worker: workerId });
    const totalStars = allReviews.reduce((sum, r) => sum + r.stars, 0);
    const newRating = totalStars / allReviews.length;

    await WorkerProfile.findOneAndUpdate(
      { user: workerId },
      {
        rating: Math.round(newRating * 10) / 10,
        reviewCount: allReviews.length
      }
    );

    res.status(201).json({ message: '✅ Баҳо гузошта шуд!', review });
  } catch (err) {
    res.status(500).json({ message: '❌ Хатогӣ:', error: err.message });
  }
};

// Отзывҳои усторо гирифтан
exports.getWorkerReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ worker: req.params.workerId })
      .populate('customer', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: '❌ Хатогӣ:', error: err.message });
  }
};