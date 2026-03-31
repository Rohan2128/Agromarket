// ============================================================
// User Model - Buyer & Seller profiles
// ============================================================
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  line1: { type: String, default: '' },
  line2: { type: String, default: '' },
  city: { type: String, default: 'Amravati' },
  state: { type: String, default: 'Maharashtra' },
  pincode: { type: String, default: '' }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true, minlength: 2 },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'] },
  phone: { type: String, required: [true, 'Phone is required'], trim: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number'] },
  password: { type: String, required: [true, 'Password is required'], minlength: 6 },
  role: { type: String, enum: ['buyer', 'farmer', 'both'], default: 'buyer' },
  location: { type: String, default: 'Amravati' },
  address: { type: addressSchema, default: () => ({}) },
  bio: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
