// ============================================================
// Product Routes - Full CRUD Operations
// ============================================================
const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/products - Display all products (public)
router.get('/', async (req, res) => {
  try {
    const { category, search, seller } = req.query;
    let filter = { isActive: true };

    if (category && category !== 'all') filter.category = category;
    if (seller) filter.seller = seller;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { sellerName: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, products, count: products.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products/:id - Display single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/products - Insert new product (auth required)
router.post('/', auth, async (req, res) => {
  try {
    const { name, category, price, unit, emoji, description, stock, location } = req.body;

    // Validation
    if (!name || !category || !price || !stock) {
      return res.status(400).json({ success: false, message: 'Name, category, price, and stock are required' });
    }
    if (price < 1) return res.status(400).json({ success: false, message: 'Price must be at least ₹1' });
    if (stock < 1) return res.status(400).json({ success: false, message: 'Stock must be at least 1' });

    const product = new Product({
      name, category, price, unit: unit || 'kg',
      emoji: emoji || '📦', description: description || `Fresh ${name} from ${location || 'Amravati'}`,
      stock, location: location || 'Amravati',
      seller: req.user.id,
      sellerName: req.user.name
    });

    await product.save();
    res.status(201).json({ success: true, message: `"${name}" listed successfully!`, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/products/:id - Update product (auth required, seller only)
router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only update your own products' });
    }

    const { name, price, stock, description, location, isActive } = req.body;
    if (name) product.name = name;
    if (price !== undefined) { if (price < 1) return res.status(400).json({ success: false, message: 'Price must be positive' }); product.price = price; }
    if (stock !== undefined) { if (stock < 0) return res.status(400).json({ success: false, message: 'Stock cannot be negative' }); product.stock = stock; }
    if (description) product.description = description;
    if (location) product.location = location;
    if (isActive !== undefined) product.isActive = isActive;

    await product.save();
    res.json({ success: true, message: 'Product updated successfully', product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/products/:id - Delete product (auth required, seller only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only delete your own products' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: `"${product.name}" deleted successfully` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products/seller/my - Get seller's own products
router.get('/seller/my', auth, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, products, count: products.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
