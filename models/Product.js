// ============================================================
// Product Model - Agricultural products
// ============================================================
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Product name is required'], trim: true },
  category: { type: String, required: [true, 'Category is required'],
    enum: ['crops', 'vegetables', 'fruits', 'grains', 'pulses', 'spices', 'dairy', 'oilseeds'] },
  price: { type: Number, required: [true, 'Price is required'], min: [1, 'Price must be positive'] },
  unit: { type: String, required: true, enum: ['kg', 'quintal', 'dozen', 'litre', 'piece'], default: 'kg' },
  emoji: { type: String, default: '📦' },
  description: { type: String, default: '' },
  stock: { type: Number, required: true, min: 0, default: 0 },
  rating: { type: Number, default: 4.0, min: 0, max: 5 },
  location: { type: String, default: 'Amravati' },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sellerName: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for search
productSchema.index({ name: 'text', description: 'text', location: 'text' });

module.exports = mongoose.model('Product', productSchema);
