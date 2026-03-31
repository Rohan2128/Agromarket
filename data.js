// ============================================================
// AgroMarket Amravati - Product Database & Market Data
// ============================================================

const CATEGORIES = [
  { id: 'crops', name: 'Crops', icon: '🌾', color: '#e6a817' },
  { id: 'vegetables', name: 'Vegetables', icon: '🥬', color: '#4caf50' },
  { id: 'fruits', name: 'Fruits', icon: '🍊', color: '#ff9800' },
  { id: 'grains', name: 'Grains & Cereals', icon: '🌽', color: '#c6893f' },
  { id: 'pulses', name: 'Pulses & Lentils', icon: '🫘', color: '#8d6e63' },
  { id: 'spices', name: 'Spices', icon: '🌶️', color: '#e53935' },
  { id: 'dairy', name: 'Dairy Products', icon: '🥛', color: '#90caf9' },
  { id: 'oilseeds', name: 'Oilseeds', icon: '🌻', color: '#fdd835' },
];

const PRODUCTS = [
  // --- Crops ---
  { id: 1, name: 'Organic Wheat', category: 'crops', price: 2800, unit: 'quintal', emoji: '🌾', seller: 'Ramesh Patil', location: 'Warud, Amravati', rating: 4.5, stock: 120, description: 'Premium quality organic wheat grown without pesticides. High protein content ideal for chapati and bread making.' },
  { id: 2, name: 'Basmati Rice', category: 'crops', price: 4500, unit: 'quintal', emoji: '🍚', seller: 'Suresh Deshmukh', location: 'Morshi, Amravati', rating: 4.8, stock: 80, description: 'Long-grain aromatic basmati rice. Aged for 1 year for best flavor and texture.' },
  { id: 3, name: 'Cotton (Kapas)', category: 'crops', price: 6200, unit: 'quintal', emoji: '🏵️', seller: 'Ganesh Wankhede', location: 'Achalpur, Amravati', rating: 4.3, stock: 200, description: 'High-quality raw cotton, hand-picked. Ideal for textile mills and ginning factories.' },
  { id: 4, name: 'Soybean', category: 'crops', price: 4800, unit: 'quintal', emoji: '🫛', seller: 'Vikram Jadhav', location: 'Daryapur, Amravati', rating: 4.6, stock: 150, description: 'Non-GMO soybean with high oil content. Perfect for oil extraction and animal feed.' },
  { id: 5, name: 'Sugarcane', category: 'crops', price: 350, unit: 'quintal', emoji: '🎋', seller: 'Manoj Shinde', location: 'Chandur Bazar, Amravati', rating: 4.2, stock: 500, description: 'Fresh sugarcane with high sucrose content. Suitable for jaggery and sugar production.' },
  { id: 6, name: 'Jowar (Sorghum)', category: 'crops', price: 3200, unit: 'quintal', emoji: '🌾', seller: 'Prakash More', location: 'Nandgaon Khandeshwar', rating: 4.4, stock: 90, description: 'Traditional Vidarbha jowar, excellent for bhakri and flour. Gluten-free grain.' },

  // --- Vegetables ---
  { id: 7, name: 'Fresh Tomatoes', category: 'vegetables', price: 40, unit: 'kg', emoji: '🍅', seller: 'Sunita Gawande', location: 'Amravati City', rating: 4.7, stock: 500, description: 'Farm-fresh red tomatoes, harvested today. Rich in lycopene and perfect for cooking.' },
  { id: 8, name: 'Onions (Kanda)', category: 'vegetables', price: 25, unit: 'kg', emoji: '🧅', seller: 'Deepak Bhoyar', location: 'Anjangaon Surji', rating: 4.5, stock: 800, description: 'Premium Nashik variety onions. Long shelf life, ideal for wholesale and retail.' },
  { id: 9, name: 'Potatoes (Batata)', category: 'vegetables', price: 30, unit: 'kg', emoji: '🥔', seller: 'Anita Meshram', location: 'Paratwada, Amravati', rating: 4.3, stock: 600, description: 'Fresh potatoes perfect for all cooking needs. Sourced from Amravati district farms.' },
  { id: 10, name: 'Green Chillies', category: 'vegetables', price: 80, unit: 'kg', emoji: '🌶️', seller: 'Rahul Thakre', location: 'Bhatkuli, Amravati', rating: 4.6, stock: 200, description: 'Spicy green chillies, freshly harvested. Adds perfect heat to any dish.' },
  { id: 11, name: 'Brinjal (Vangi)', category: 'vegetables', price: 35, unit: 'kg', emoji: '🍆', seller: 'Meena Ingle', location: 'Teosa, Amravati', rating: 4.4, stock: 300, description: 'Purple brinjal perfect for bharit and vangi bhaat. Farm fresh quality.' },
  { id: 12, name: 'Cabbage (Kobi)', category: 'vegetables', price: 20, unit: 'kg', emoji: '🥬', seller: 'Anil Raut', location: 'Amravati City', rating: 4.2, stock: 400, description: 'Fresh green cabbage, crisp and healthy. Great for salads and sabzi.' },
  { id: 13, name: 'Cauliflower (Phulkobi)', category: 'vegetables', price: 40, unit: 'kg', emoji: '🥦', seller: 'Sanjay Kale', location: 'Morshi, Amravati', rating: 4.5, stock: 250, description: 'White, fresh cauliflower heads. Perfect for gobi manchurian and curries.' },
  { id: 14, name: 'Lady Finger (Bhindi)', category: 'vegetables', price: 50, unit: 'kg', emoji: '🥒', seller: 'Priya Wagh', location: 'Chandur Railway', rating: 4.3, stock: 180, description: 'Tender okra, perfect for frying and curry. No pesticide residue.' },

  // --- Fruits ---
  { id: 15, name: 'Nagpur Orange', category: 'fruits', price: 80, unit: 'kg', emoji: '🍊', seller: 'Vinod Thakare', location: 'Warud, Amravati', rating: 4.9, stock: 350, description: 'Famous Nagpur santra (orange). Sweet, juicy, and rich in Vitamin C. Vidarbha specialty!' },
  { id: 16, name: 'Banana (Kela)', category: 'fruits', price: 40, unit: 'dozen', emoji: '🍌', seller: 'Kiran Pawar', location: 'Amravati City', rating: 4.5, stock: 600, description: 'Fresh ripe bananas, naturally ripened. Great source of potassium and energy.' },
  { id: 17, name: 'Pomegranate (Dalimb)', category: 'fruits', price: 150, unit: 'kg', emoji: '🫐', seller: 'Sachin Deshmukh', location: 'Daryapur, Amravati', rating: 4.7, stock: 200, description: 'Ruby-red pomegranate seeds. Bhagwa variety, sweet and antioxidant-rich.' },
  { id: 18, name: 'Guava (Peru)', category: 'fruits', price: 60, unit: 'kg', emoji: '🍐', seller: 'Nilesh Borkar', location: 'Chandur Bazar', rating: 4.4, stock: 280, description: 'Crisp and sweet guava. Rich in Vitamin C, perfect for eating fresh or in juice.' },
  { id: 19, name: 'Mango (Amba)', category: 'fruits', price: 120, unit: 'kg', emoji: '🥭', seller: 'Ravi Naik', location: 'Achalpur, Amravati', rating: 4.8, stock: 100, description: 'Alphonso and Kesar variety mangoes. The king of fruits from Vidarbha orchards.' },
  { id: 20, name: 'Watermelon (Kalingad)', category: 'fruits', price: 15, unit: 'kg', emoji: '🍉', seller: 'Ajay Thombre', location: 'Nandgaon Khandeshwar', rating: 4.3, stock: 400, description: 'Sweet and refreshing watermelon. Perfect summer fruit, locally grown.' },

  // --- Grains & Cereals ---
  { id: 21, name: 'Bajra (Pearl Millet)', category: 'grains', price: 2600, unit: 'quintal', emoji: '🌾', seller: 'Sunil Gawai', location: 'Morshi, Amravati', rating: 4.4, stock: 70, description: 'Nutritious bajra grain, rich in iron and fiber. Ideal for rotla and porridge.' },
  { id: 22, name: 'Maize (Makka)', category: 'grains', price: 2200, unit: 'quintal', emoji: '🌽', seller: 'Ashok Rathod', location: 'Daryapur, Amravati', rating: 4.3, stock: 110, description: 'Yellow corn/maize. Used for poultry feed, corn flour, and popcorn production.' },
  { id: 23, name: 'Ragi (Finger Millet)', category: 'grains', price: 3500, unit: 'quintal', emoji: '🌾', seller: 'Mangesh Dive', location: 'Warud, Amravati', rating: 4.6, stock: 50, description: 'Super-food ragi, extremely high in calcium. Perfect for health-conscious consumers.' },

  // --- Pulses ---
  { id: 24, name: 'Toor Dal (Arhar)', category: 'pulses', price: 120, unit: 'kg', emoji: '🫘', seller: 'Kishor Bawane', location: 'Amravati City', rating: 4.5, stock: 300, description: 'Premium toor dal, cleaned and polished. Staple for dal fry and sambar.' },
  { id: 25, name: 'Moong Dal', category: 'pulses', price: 110, unit: 'kg', emoji: '🫘', seller: 'Vilas Giri', location: 'Achalpur, Amravati', rating: 4.6, stock: 250, description: 'Split green gram dal. Light and easy to digest, perfect for khichdi.' },
  { id: 26, name: 'Chana Dal', category: 'pulses', price: 80, unit: 'kg', emoji: '🫘', seller: 'Narayan Meshram', location: 'Paratwada', rating: 4.4, stock: 350, description: 'Bengal gram dal, versatile for many dishes. Rich in protein and fiber.' },
  { id: 27, name: 'Urad Dal (Black Gram)', category: 'pulses', price: 130, unit: 'kg', emoji: '🫘', seller: 'Shyam Yadav', location: 'Teosa, Amravati', rating: 4.5, stock: 180, description: 'Premium urad dal for dal makhani, idli, and dosa batter. High protein content.' },
  { id: 28, name: 'Masoor Dal (Red Lentil)', category: 'pulses', price: 90, unit: 'kg', emoji: '🫘', seller: 'Dinesh Khandare', location: 'Bhatkuli, Amravati', rating: 4.3, stock: 220, description: 'Quick-cooking red lentils. Nutritious and affordable everyday dal.' },

  // --- Spices ---
  { id: 29, name: 'Turmeric (Haldi)', category: 'spices', price: 180, unit: 'kg', emoji: '🟡', seller: 'Lata Deshmukh', location: 'Anjangaon Surji', rating: 4.8, stock: 150, description: 'Pure Vidarbha turmeric with high curcumin content. Deep yellow color and medicinal properties.' },
  { id: 30, name: 'Red Chilli Powder', category: 'spices', price: 250, unit: 'kg', emoji: '🌶️', seller: 'Bharat Thakur', location: 'Chandur Bazar', rating: 4.6, stock: 200, description: 'Fiery red chilli powder. Perfect color and heat for authentic Maharashtrian cooking.' },
  { id: 31, name: 'Cumin Seeds (Jeera)', category: 'spices', price: 350, unit: 'kg', emoji: '🫙', seller: 'Kamla Patil', location: 'Amravati City', rating: 4.7, stock: 100, description: 'Whole cumin seeds, highly aromatic. Essential spice for tempering and spice blends.' },
  { id: 32, name: 'Coriander Powder', category: 'spices', price: 200, unit: 'kg', emoji: '🫙', seller: 'Usha Raut', location: 'Morshi, Amravati', rating: 4.5, stock: 180, description: 'Freshly ground coriander powder. Adds depth and flavor to curries and gravies.' },
  { id: 33, name: 'Mustard Seeds (Mohari)', category: 'spices', price: 160, unit: 'kg', emoji: '🫙', seller: 'Geeta Wankhede', location: 'Daryapur', rating: 4.4, stock: 250, description: 'Black mustard seeds for traditional tadka. Essential in Maharashtrian cuisine.' },

  // --- Dairy ---
  { id: 34, name: 'Fresh Cow Milk', category: 'dairy', price: 55, unit: 'litre', emoji: '🥛', seller: 'Govind Dairy Farm', location: 'Amravati City', rating: 4.7, stock: 500, description: 'Pure cow milk, delivered fresh daily. No preservatives or additives.' },
  { id: 35, name: 'Desi Ghee', category: 'dairy', price: 600, unit: 'kg', emoji: '🧈', seller: 'Savita Dairy', location: 'Warud, Amravati', rating: 4.9, stock: 80, description: 'Pure desi ghee made from cow milk. Rich aroma and taste, traditional bilona method.' },
  { id: 36, name: 'Fresh Paneer', category: 'dairy', price: 320, unit: 'kg', emoji: '🧀', seller: 'Nandini Dairy', location: 'Paratwada', rating: 4.6, stock: 120, description: 'Soft and fresh paneer (cottage cheese). Made daily from pure milk.' },
  { id: 37, name: 'Curd (Dahi)', category: 'dairy', price: 50, unit: 'kg', emoji: '🥣', seller: 'Govind Dairy Farm', location: 'Amravati City', rating: 4.5, stock: 300, description: 'Thick and creamy homemade-style curd. Set naturally with live cultures.' },

  // --- Oilseeds ---
  { id: 38, name: 'Groundnut (Shengdana)', category: 'oilseeds', price: 90, unit: 'kg', emoji: '🥜', seller: 'Rajesh Kumbhare', location: 'Chandur Railway', rating: 4.5, stock: 400, description: 'Raw groundnuts, high oil content. Perfect for oil pressing, chikki, and cooking.' },
  { id: 39, name: 'Sunflower Seeds', category: 'oilseeds', price: 120, unit: 'kg', emoji: '🌻', seller: 'Mahesh Tiwari', location: 'Nandgaon Khandeshwar', rating: 4.3, stock: 200, description: 'Premium sunflower seeds for oil extraction. High in Vitamin E and healthy fats.' },
  { id: 40, name: 'Sesame Seeds (Til)', category: 'oilseeds', price: 200, unit: 'kg', emoji: '🫘', seller: 'Pramod Gawande', location: 'Teosa, Amravati', rating: 4.6, stock: 150, description: 'White sesame seeds. Used for til ladoo, oil production, and garnishing.' },
  { id: 41, name: 'Flaxseeds (Jawas)', category: 'oilseeds', price: 180, unit: 'kg', emoji: '🫘', seller: 'Sunanda Borkar', location: 'Achalpur', rating: 4.7, stock: 100, description: 'Omega-3 rich flaxseeds. Superfood for health-conscious consumers. Used in chutney and laddoo.' },
  { id: 42, name: 'Safflower (Kardai)', category: 'oilseeds', price: 150, unit: 'kg', emoji: '🌻', seller: 'Dinesh Rathod', location: 'Daryapur', rating: 4.4, stock: 130, description: 'Safflower seeds for premium cooking oil. Vidarbha\'s traditional oilseed crop.' },
];

// Amravati Market Locations for the Map
const MARKET_LOCATIONS = [
  { name: 'Amravati Main Mandi (APMC)', lat: 20.9320, lng: 77.7523, type: 'main', description: 'Central agricultural produce market committee. Largest mandi in Amravati district.', timings: '6:00 AM - 6:00 PM' },
  { name: 'Cotton Market Yard', lat: 20.9370, lng: 77.7620, type: 'cotton', description: 'Dedicated cotton trading market. Major hub for Vidarbha cotton trade.', timings: '7:00 AM - 5:00 PM' },
  { name: 'Fruit & Vegetable Market', lat: 20.9280, lng: 77.7450, type: 'fruit', description: 'Fresh fruits and vegetables wholesale market. Daily fresh produce.', timings: '4:00 AM - 2:00 PM' },
  { name: 'Grain Market (Dhanya Bazaar)', lat: 20.9350, lng: 77.7490, type: 'grain', description: 'Wholesale grain and cereals market. Trading in wheat, rice, jowar, bajra.', timings: '8:00 AM - 6:00 PM' },
  { name: 'Rajkamal Chowk Market', lat: 20.9300, lng: 77.7550, type: 'general', description: 'Mixed market with spices, pulses, and daily essentials.', timings: '7:00 AM - 9:00 PM' },
  { name: 'Achalpur Mandi', lat: 21.2560, lng: 77.5110, type: 'main', description: 'Sub-district agricultural market in Achalpur (Ellichpur).', timings: '6:00 AM - 5:00 PM' },
  { name: 'Morshi Agricultural Market', lat: 21.3000, lng: 78.0100, type: 'main', description: 'Agricultural produce market in Morshi taluka.', timings: '7:00 AM - 4:00 PM' },
  { name: 'Paratwada Market', lat: 21.2650, lng: 77.5230, type: 'general', description: 'Local market in Paratwada for vegetables and daily needs.', timings: '6:00 AM - 8:00 PM' },
  { name: 'Warud Farmers Market', lat: 21.4720, lng: 78.2700, type: 'fruit', description: 'Known for orange orchards and citrus fruit trading.', timings: '6:00 AM - 4:00 PM' },
  { name: 'Daryapur Oilseed Market', lat: 20.9200, lng: 77.3300, type: 'oilseed', description: 'Major trading hub for soybean and other oilseeds.', timings: '7:00 AM - 5:00 PM' },
];

// Payment methods
const PAYMENT_METHODS = [
  { id: 'upi', name: 'UPI Payment', icon: '📱', desc: 'Pay via Google Pay, PhonePe, Paytm' },
  { id: 'card', name: 'Credit/Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', name: 'Net Banking', icon: '🏦', desc: 'All major banks supported' },
  { id: 'cod', name: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive' },
];
