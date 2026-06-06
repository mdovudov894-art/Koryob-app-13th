const WorkerProfile = require('../models/WorkerProfile');
const User = require('../models/User');

// Профили усторо гирифтан
exports.getProfile = async (req, res) => {
  try {
    const profile = await WorkerProfile.findOne({ user: req.user.id })
      .populate('user', 'name phone region avatar');
    if (!profile) {
      return res.status(404).json({ message: '❌ Профил ёфт нашуд!' });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: '❌ Хатогӣ:', error: err.message });
  }
};

// Профили усторо навсозӣ кардан
exports.updateProfile = async (req, res) => {
  try {
    const { categories, priceList, bio } = req.body;
    const profile = await WorkerProfile.findOneAndUpdate(
      { user: req.user.id },
      { categories, priceList, bio },
      { new: true }
    );
    res.json({ message: '✅ Профил навсозӣ шуд!', profile });
  } catch (err) {
    res.status(500).json({ message: '❌ Хатогӣ:', error: err.message });
  }
};

// Статусро дигар кардан (Озод/Банд)
exports.toggleStatus = async (req, res) => {
  try {
    const profile = await WorkerProfile.findOne({ user: req.user.id });
    profile.status = profile.status === 'Озод' ? 'Банд' : 'Озод';
    await profile.save();
    res.json({ message: `✅ Статус: ${profile.status}`, status: profile.status });
  } catch (err) {
    res.status(500).json({ message: '❌ Хатогӣ:', error: err.message });
  }
};

// Портфолио илова кардан
exports.addPortfolio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '❌ Сурат интихоб нашудааст!' });
    }
    const profile = await WorkerProfile.findOneAndUpdate(
      { user: req.user.id },
      { $push: { portfolio: req.file.path } },
      { new: true }
    );
    res.json({ message: '✅ Сурат илова шуд!', portfolio: profile.portfolio });
  } catch (err) {
    res.status(500).json({ message: '❌ Хатогӣ:', error: err.message });
  }
};

// Ҳамаи устоҳоро гирифтан (бо филтр)
exports.getAllWorkers = async (req, res) => {
  try {
    const { category, region, status } = req.query;
    let userFilter = {};
    let profileFilter = {};

    if (region) userFilter.region = region;
    if (category) profileFilter.categories = { $in: [category] };
    if (status) profileFilter.status = status;

    const users = await User.find({ ...userFilter, role: 'worker' }).select('-password');
    const userIds = users.map(u => u._id);

    const profiles = await WorkerProfile.find({
      user: { $in: userIds },
      ...profileFilter
    })
      .populate('user', 'name phone region avatar')
      .sort({ rating: -1 });

    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: '❌ Хатогӣ:', error: err.message });
  }
};