// ============================================================
// Order Model - Order tracking with live status
// ============================================================
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: String,
  productEmoji: String,
  price: Number,
  unit: String,
  qty: { type: Number, min: 1 },
  sellerName: String
}, { _id: false });

const trackingEventSchema = new mongoose.Schema({
  status: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  buyerName: String,
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  delivery: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: { type: String, enum: ['placed', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'placed' },
  paymentMethod: { type: String, enum: ['upi', 'card', 'netbanking', 'cod'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  upiTransactionId: { type: String, default: '' },
  deliveryAddress: {
    name: String,
    phone: String,
    line1: String,
    line2: String,
    city: { type: String, default: 'Amravati' },
    state: { type: String, default: 'Maharashtra' },
    pincode: String
  },
  estimatedDelivery: { type: Date },
  tracking: [trackingEventSchema],
  encryptedPaymentData: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// Generate order ID before save
orderSchema.pre('save', function(next) {
  if (!this.orderId) {
    this.orderId = 'AGM' + Date.now().toString().slice(-8);
  }
  // Set estimated delivery (2-4 days)
  if (!this.estimatedDelivery) {
    const days = this.paymentMethod === 'cod' ? 4 : 3;
    this.estimatedDelivery = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }
  // Add initial tracking
  if (this.tracking.length === 0) {
    this.tracking.push({
      status: 'placed',
      message: 'Order has been placed successfully',
      timestamp: new Date()
    });
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
