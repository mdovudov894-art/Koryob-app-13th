const User = require('../models/User');
const WorkerProfile = require('../models/WorkerProfile');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Рӯйхатнависӣ (Регистрация)
exports.register = async (req, res) => {
  try {
    const { name, phone, password, role, region } = req.body;

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: '❌ Ин рақами телефон аллакай рӯйхат шудааст!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      phone,
      password: hashedPassword,
      role,
      region
    });

    if (role === 'worker') {
      await WorkerProfile.create({ user: user._id });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: '✅ Рӯйхатнависӣ муваффақ шуд!',
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        region: user.region
      }
    });
  } catch (err) {
    res.status(500).json({ message: '❌ Хатогӣ:', error: err.message });
  }
};

// Дохил шудан (Логин)
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: '❌ Корбар ёфт нашуд!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '❌ Парол нодуруст!' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      message: '✅ Хуш омадед!',
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        region: user.region
      }
    });
  } catch (err) {
    res.status(500).json({ message: '❌ Хатогӣ:', error: err.message });
  }
};