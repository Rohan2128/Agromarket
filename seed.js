// ============================================================
// Database Seeder - Populate MongoDB with initial data
// ============================================================
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agromarket';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create seller accounts
    const sellers = await User.create([
      { name: 'Ramesh Patil', email: 'ramesh@farmer.com', phone: '9876543210', password: 'farmer123', role: 'farmer', location: 'Warud, Amravati' },
      { name: 'Suresh Deshmukh', email: 'suresh@farmer.com', phone: '9876543211', password: 'farmer123', role: 'farmer', location: 'Morshi, Amravati' },
      { name: 'Ganesh Wankhede', email: 'ganesh@farmer.com', phone: '9876543212', password: 'farmer123', role: 'farmer', location: 'Achalpur, Amravati' },
      { name: 'Sunita Gawande', email: 'sunita@farmer.com', phone: '9876543213', password: 'farmer123', role: 'farmer', location: 'Amravati City' },
      { name: 'Vinod Thakare', email: 'vinod@farmer.com', phone: '9876543214', password: 'farmer123', role: 'farmer', location: 'Warud, Amravati' },
      { name: 'Govind Dairy Farm', email: 'govind@farmer.com', phone: '9876543215', password: 'farmer123', role: 'farmer', location: 'Amravati City' },
    ]);

    console.log(`👥 Created ${sellers.length} seller accounts`);

    // Create products
    const products = [
      // Crops
      { name: 'Organic Wheat', category: 'crops', price: 2800, unit: 'quintal', emoji: '🌾', seller: sellers[0]._id, sellerName: sellers[0].name, location: 'Warud, Amravati', rating: 4.5, stock: 120, description: 'Premium quality organic wheat grown without pesticides. High protein content ideal for chapati and bread making.' },
      { name: 'Basmati Rice', category: 'crops', price: 4500, unit: 'quintal', emoji: '🍚', seller: sellers[1]._id, sellerName: sellers[1].name, location: 'Morshi, Amravati', rating: 4.8, stock: 80, description: 'Long-grain aromatic basmati rice. Aged for 1 year for best flavor and texture.' },
      { name: 'Cotton (Kapas)', category: 'crops', price: 6200, unit: 'quintal', emoji: '🏵️', seller: sellers[2]._id, sellerName: sellers[2].name, location: 'Achalpur, Amravati', rating: 4.3, stock: 200, description: 'High-quality raw cotton, hand-picked. Ideal for textile mills.' },
      { name: 'Soybean', category: 'crops', price: 4800, unit: 'quintal', emoji: '🫛', seller: sellers[0]._id, sellerName: sellers[0].name, location: 'Daryapur, Amravati', rating: 4.6, stock: 150, description: 'Non-GMO soybean with high oil content.' },
      { name: 'Sugarcane', category: 'crops', price: 350, unit: 'quintal', emoji: '🎋', seller: sellers[1]._id, sellerName: sellers[1].name, location: 'Chandur Bazar', rating: 4.2, stock: 500, description: 'Fresh sugarcane with high sucrose content.' },
      { name: 'Jowar (Sorghum)', category: 'crops', price: 3200, unit: 'quintal', emoji: '🌾', seller: sellers[2]._id, sellerName: sellers[2].name, location: 'Nandgaon Khandeshwar', rating: 4.4, stock: 90, description: 'Traditional Vidarbha jowar, excellent for bhakri.' },
      // Vegetables
      { name: 'Fresh Tomatoes', category: 'vegetables', price: 40, unit: 'kg', emoji: '🍅', seller: sellers[3]._id, sellerName: sellers[3].name, location: 'Amravati City', rating: 4.7, stock: 500, description: 'Farm-fresh red tomatoes, harvested today.' },
      { name: 'Onions (Kanda)', category: 'vegetables', price: 25, unit: 'kg', emoji: '🧅', seller: sellers[0]._id, sellerName: sellers[0].name, location: 'Anjangaon Surji', rating: 4.5, stock: 800, description: 'Premium Nashik variety onions. Long shelf life.' },
      { name: 'Potatoes (Batata)', category: 'vegetables', price: 30, unit: 'kg', emoji: '🥔', seller: sellers[3]._id, sellerName: sellers[3].name, location: 'Paratwada', rating: 4.3, stock: 600, description: 'Fresh potatoes perfect for all cooking needs.' },
      { name: 'Green Chillies', category: 'vegetables', price: 80, unit: 'kg', emoji: '🌶️', seller: sellers[1]._id, sellerName: sellers[1].name, location: 'Bhatkuli', rating: 4.6, stock: 200, description: 'Spicy green chillies, freshly harvested.' },
      { name: 'Brinjal (Vangi)', category: 'vegetables', price: 35, unit: 'kg', emoji: '🍆', seller: sellers[3]._id, sellerName: sellers[3].name, location: 'Teosa', rating: 4.4, stock: 300, description: 'Purple brinjal perfect for bharit and vangi bhaat.' },
      { name: 'Cabbage (Kobi)', category: 'vegetables', price: 20, unit: 'kg', emoji: '🥬', seller: sellers[0]._id, sellerName: sellers[0].name, location: 'Amravati City', rating: 4.2, stock: 400, description: 'Fresh green cabbage, crisp and healthy.' },
      { name: 'Cauliflower (Phulkobi)', category: 'vegetables', price: 40, unit: 'kg', emoji: '🥦', seller: sellers[1]._id, sellerName: sellers[1].name, location: 'Morshi', rating: 4.5, stock: 250, description: 'White, fresh cauliflower heads.' },
      { name: 'Lady Finger (Bhindi)', category: 'vegetables', price: 50, unit: 'kg', emoji: '🥒', seller: sellers[3]._id, sellerName: sellers[3].name, location: 'Chandur Railway', rating: 4.3, stock: 180, description: 'Tender okra, perfect for frying and curry.' },
      // Fruits
      { name: 'Nagpur Orange', category: 'fruits', price: 80, unit: 'kg', emoji: '🍊', seller: sellers[4]._id, sellerName: sellers[4].name, location: 'Warud, Amravati', rating: 4.9, stock: 350, description: 'Famous Nagpur santra, sweet and juicy. Vidarbha specialty!' },
      { name: 'Banana (Kela)', category: 'fruits', price: 40, unit: 'dozen', emoji: '🍌', seller: sellers[3]._id, sellerName: sellers[3].name, location: 'Amravati City', rating: 4.5, stock: 600, description: 'Fresh ripe bananas, naturally ripened.' },
      { name: 'Pomegranate (Dalimb)', category: 'fruits', price: 150, unit: 'kg', emoji: '🫐', seller: sellers[1]._id, sellerName: sellers[1].name, location: 'Daryapur', rating: 4.7, stock: 200, description: 'Ruby-red pomegranate, Bhagwa variety.' },
      { name: 'Guava (Peru)', category: 'fruits', price: 60, unit: 'kg', emoji: '🍐', seller: sellers[2]._id, sellerName: sellers[2].name, location: 'Chandur Bazar', rating: 4.4, stock: 280, description: 'Crisp and sweet guava, rich in Vitamin C.' },
      { name: 'Mango (Amba)', category: 'fruits', price: 120, unit: 'kg', emoji: '🥭', seller: sellers[4]._id, sellerName: sellers[4].name, location: 'Achalpur', rating: 4.8, stock: 100, description: 'Alphonso and Kesar variety mangoes.' },
      { name: 'Watermelon (Kalingad)', category: 'fruits', price: 15, unit: 'kg', emoji: '🍉', seller: sellers[0]._id, sellerName: sellers[0].name, location: 'Nandgaon', rating: 4.3, stock: 400, description: 'Sweet and refreshing watermelon.' },
      // Grains
      { name: 'Bajra (Pearl Millet)', category: 'grains', price: 2600, unit: 'quintal', emoji: '🌾', seller: sellers[1]._id, sellerName: sellers[1].name, location: 'Morshi', rating: 4.4, stock: 70, description: 'Nutritious bajra, rich in iron and fiber.' },
      { name: 'Maize (Makka)', category: 'grains', price: 2200, unit: 'quintal', emoji: '🌽', seller: sellers[2]._id, sellerName: sellers[2].name, location: 'Daryapur', rating: 4.3, stock: 110, description: 'Yellow corn/maize for feed and flour.' },
      { name: 'Ragi (Finger Millet)', category: 'grains', price: 3500, unit: 'quintal', emoji: '🌾', seller: sellers[0]._id, sellerName: sellers[0].name, location: 'Warud', rating: 4.6, stock: 50, description: 'Super-food ragi, high in calcium.' },
      // Pulses
      { name: 'Toor Dal (Arhar)', category: 'pulses', price: 120, unit: 'kg', emoji: '🫘', seller: sellers[3]._id, sellerName: sellers[3].name, location: 'Amravati City', rating: 4.5, stock: 300, description: 'Premium toor dal, cleaned and polished.' },
      { name: 'Moong Dal', category: 'pulses', price: 110, unit: 'kg', emoji: '🫘', seller: sellers[2]._id, sellerName: sellers[2].name, location: 'Achalpur', rating: 4.6, stock: 250, description: 'Split green gram dal, light and digestible.' },
      { name: 'Chana Dal', category: 'pulses', price: 80, unit: 'kg', emoji: '🫘', seller: sellers[0]._id, sellerName: sellers[0].name, location: 'Paratwada', rating: 4.4, stock: 350, description: 'Bengal gram dal, versatile and nutritious.' },
      { name: 'Urad Dal (Black Gram)', category: 'pulses', price: 130, unit: 'kg', emoji: '🫘', seller: sellers[1]._id, sellerName: sellers[1].name, location: 'Teosa', rating: 4.5, stock: 180, description: 'Premium urad dal for dal makhani.' },
      { name: 'Masoor Dal (Red Lentil)', category: 'pulses', price: 90, unit: 'kg', emoji: '🫘', seller: sellers[3]._id, sellerName: sellers[3].name, location: 'Bhatkuli', rating: 4.3, stock: 220, description: 'Quick-cooking red lentils, nutritious.' },
      // Spices
      { name: 'Turmeric (Haldi)', category: 'spices', price: 180, unit: 'kg', emoji: '🟡', seller: sellers[0]._id, sellerName: sellers[0].name, location: 'Anjangaon Surji', rating: 4.8, stock: 150, description: 'Pure Vidarbha turmeric, high curcumin content.' },
      { name: 'Red Chilli Powder', category: 'spices', price: 250, unit: 'kg', emoji: '🌶️', seller: sellers[1]._id, sellerName: sellers[1].name, location: 'Chandur Bazar', rating: 4.6, stock: 200, description: 'Fiery red chilli powder for authentic cooking.' },
      { name: 'Cumin Seeds (Jeera)', category: 'spices', price: 350, unit: 'kg', emoji: '🫙', seller: sellers[3]._id, sellerName: sellers[3].name, location: 'Amravati City', rating: 4.7, stock: 100, description: 'Whole cumin seeds, highly aromatic.' },
      { name: 'Coriander Powder', category: 'spices', price: 200, unit: 'kg', emoji: '🫙', seller: sellers[2]._id, sellerName: sellers[2].name, location: 'Morshi', rating: 4.5, stock: 180, description: 'Freshly ground coriander powder.' },
      { name: 'Mustard Seeds (Mohari)', category: 'spices', price: 160, unit: 'kg', emoji: '🫙', seller: sellers[4]._id, sellerName: sellers[4].name, location: 'Daryapur', rating: 4.4, stock: 250, description: 'Black mustard seeds for traditional tadka.' },
      // Dairy
      { name: 'Fresh Cow Milk', category: 'dairy', price: 55, unit: 'litre', emoji: '🥛', seller: sellers[5]._id, sellerName: sellers[5].name, location: 'Amravati City', rating: 4.7, stock: 500, description: 'Pure cow milk, delivered fresh daily.' },
      { name: 'Desi Ghee', category: 'dairy', price: 600, unit: 'kg', emoji: '🧈', seller: sellers[5]._id, sellerName: sellers[5].name, location: 'Warud', rating: 4.9, stock: 80, description: 'Pure desi ghee, traditional bilona method.' },
      { name: 'Fresh Paneer', category: 'dairy', price: 320, unit: 'kg', emoji: '🧀', seller: sellers[5]._id, sellerName: sellers[5].name, location: 'Paratwada', rating: 4.6, stock: 120, description: 'Soft and fresh paneer, made daily.' },
      { name: 'Curd (Dahi)', category: 'dairy', price: 50, unit: 'kg', emoji: '🥣', seller: sellers[5]._id, sellerName: sellers[5].name, location: 'Amravati City', rating: 4.5, stock: 300, description: 'Thick and creamy homemade-style curd.' },
      // Oilseeds
      { name: 'Groundnut (Shengdana)', category: 'oilseeds', price: 90, unit: 'kg', emoji: '🥜', seller: sellers[2]._id, sellerName: sellers[2].name, location: 'Chandur Railway', rating: 4.5, stock: 400, description: 'Raw groundnuts, high oil content.' },
      { name: 'Sunflower Seeds', category: 'oilseeds', price: 120, unit: 'kg', emoji: '🌻', seller: sellers[0]._id, sellerName: sellers[0].name, location: 'Nandgaon', rating: 4.3, stock: 200, description: 'Premium sunflower seeds for oil extraction.' },
      { name: 'Sesame Seeds (Til)', category: 'oilseeds', price: 200, unit: 'kg', emoji: '🫘', seller: sellers[4]._id, sellerName: sellers[4].name, location: 'Teosa', rating: 4.6, stock: 150, description: 'White sesame seeds for til ladoo and oil.' },
      { name: 'Flaxseeds (Jawas)', category: 'oilseeds', price: 180, unit: 'kg', emoji: '🫘', seller: sellers[1]._id, sellerName: sellers[1].name, location: 'Achalpur', rating: 4.7, stock: 100, description: 'Omega-3 rich flaxseeds, superfood.' },
      { name: 'Safflower (Kardai)', category: 'oilseeds', price: 150, unit: 'kg', emoji: '🌻', seller: sellers[2]._id, sellerName: sellers[2].name, location: 'Daryapur', rating: 4.4, stock: 130, description: 'Safflower seeds for premium cooking oil.' },
    ];

    const createdProducts = await Product.create(products);
    console.log(`📦 Created ${createdProducts.length} products`);

    // Create a demo buyer account
    await User.create({
      name: 'Demo Buyer', email: 'demo@buyer.com', phone: '9999999999',
      password: 'demo1234', role: 'buyer', location: 'Amravati City'
    });
    console.log('👤 Created demo buyer (demo@buyer.com / demo1234)');

    console.log('\n✅ Database seeded successfully!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seedData();
