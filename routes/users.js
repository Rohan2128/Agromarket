// ============================================================
// User Routes - Profile CRUD
// ============================================================
const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const encryption = require('../middleware/encryption');
const router = express.Router();

// GET /api/users/profile - Display user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/users/profile - Update user profile
router.put('/profile', auth, encryption.decryptMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const { name, phone, location, bio, address } = req.body;

    if (name) {
      if (name.length < 2) return res.status(400).json({ success: false, message: 'Name must be at least 2 characters' });
      user.name = name;
    }
    if (phone) {
      if (!/^[6-9]\d{9}$/.test(phone)) return res.status(400).json({ success: false, message: 'Invalid phone number' });
      user.phone = phone;
    }
    if (location) user.location = location;
    if (bio !== undefined) user.bio = bio;
    if (address) {
      user.address = {
        line1: address.line1 || user.address?.line1 || '',
        line2: address.line2 || user.address?.line2 || '',
        city: address.city || user.address?.city || 'Amravati',
        state: address.state || user.address?.state || 'Maharashtra',
        pincode: address.pincode || user.address?.pincode || ''
      };
    }

    await user.save();
    res.json({ success: true, message: 'Profile updated successfully', user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/users/password - Update password
router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Both current and new passwords are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user.id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
