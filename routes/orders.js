// ============================================================
// Order Routes - Checkout, Tracking, History
// ============================================================
const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const encryption = require('../middleware/encryption');
const router = express.Router();

const UPI_ID = process.env.UPI_ID || 'andhalerohan828@oksbi';

// POST /api/orders - Create new order & reduce stock
router.post('/', auth, encryption.decryptMiddleware, async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod, paymentData } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }
    if (!deliveryAddress || !deliveryAddress.name || !deliveryAddress.phone || !deliveryAddress.line1 || !deliveryAddress.pincode) {
      return res.status(400).json({ success: false, message: 'Complete delivery address is required' });
    }
    if (!paymentMethod) {
      return res.status(400).json({ success: false, message: 'Payment method is required' });
    }

    // Validate stock and build order items
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ success: false, message: `Product "${item.name || 'unknown'}" not found` });
      }
      if (product.stock < item.qty) {
        return res.status(400).json({ success: false, message: `Insufficient stock for "${product.name}". Available: ${product.stock}` });
      }

      // Reduce stock
      product.stock -= item.qty;
      if (product.stock === 0) product.isActive = false;
      await product.save();

      subtotal += product.price * item.qty;
      orderItems.push({
        product: product._id,
        productName: product.name,
        productEmoji: product.emoji,
        price: product.price,
        unit: product.unit,
        qty: item.qty,
        sellerName: product.sellerName
      });
    }

    const delivery = subtotal > 2000 ? 0 : 99;
    const total = subtotal + delivery;

    // Encrypt payment data
    let encryptedPaymentData = '';
    if (paymentData) {
      encryptedPaymentData = encryption.encrypt(paymentData);
    }

    const order = new Order({
      buyer: req.user.id,
      buyerName: req.user.name,
      items: orderItems,
      subtotal, delivery, total,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed',
      deliveryAddress,
      encryptedPaymentData,
      tracking: [{
        status: 'placed',
        message: 'Order has been placed successfully',
        timestamp: new Date()
      }]
    });

    await order.save();

    // Add confirmation tracking after 1 min simulation
    setTimeout(async () => {
      try {
        const o = await Order.findById(order._id);
        if (o && o.status === 'placed') {
          o.status = 'confirmed';
          o.tracking.push({ status: 'confirmed', message: 'Order confirmed by the seller', timestamp: new Date() });
          await o.save();
        }
      } catch (e) { /* ignore */ }
    }, 60000);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: {
        orderId: order.orderId,
        total: order.total,
        status: order.status,
        paymentMethod: order.paymentMethod,
        estimatedDelivery: order.estimatedDelivery,
        tracking: order.tracking
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders - Get user's orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders/:id - Get single order with tracking
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id, buyer: req.user.id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/orders/:id/status - Update order status (for tracking simulation)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status, message } = req.body;
    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const validStatuses = ['placed', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    order.status = status;
    order.tracking.push({
      status,
      message: message || `Order status updated to ${status}`,
      timestamp: new Date()
    });

    if (status === 'delivered') order.paymentStatus = 'completed';

    await order.save();
    res.json({ success: true, message: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders/seller/received - Orders containing seller's products
router.get('/seller/received', auth, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id });
    const productIds = products.map(p => p._id);
    const orders = await Order.find({ 'items.product': { $in: productIds } }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders/upi-link - Generate UPI payment link
router.get('/upi-link', auth, (req, res) => {
  const { amount, orderId } = req.query;
  const upiLink = `upi://pay?pa=${UPI_ID}&pn=AgroMarket%20Amravati&am=${amount}&cu=INR&tn=Order%20${orderId}`;
  res.json({
    success: true,
    upiId: UPI_ID,
    upiLink,
    qrData: upiLink
  });
});

module.exports = router;
