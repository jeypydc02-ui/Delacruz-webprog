const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['10.2.0.1', '8.8.8.8']);

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./modules/products/Products');
const User = require('./modules/auth/User');
const connectDB = require('./config/db');

const products = [
  {
    name: 'JEYP Air Max 95',
    slug: 'air-max-95',
    subtitle: 'Above the Influence',
    description: 'Inspired by human anatomy, the JEYP Air Max 95 features a layered upper with a wavy design. Its visible Air units deliver cushioning from heel to toe.',
    price: 8995,
    salePrice: null,
    category: 'men',
    sport: 'Lifestyle',
    badge: 'New',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    colors: ['#111111', '#E5E5E5', '#C8102E'],
    colorNames: ['Black', 'White', 'Red'],
    sizes: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    rating: 4.8, numReviews: 2341, reviews: [], featured: true,
  },
  {
    name: 'JEYP Jordan 1 Retro High OG',
    slug: 'air-jordan-1-retro',
    subtitle: 'Shotan Pack',
    description: 'The JEYP Jordan 1 Retro High OG brings back classic basketball style with premium leather construction and iconic Wings logo.',
    price: 11995,
    salePrice: null,
    category: 'men',
    sport: 'Basketball',
    badge: 'Just In',
    image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&q=80',
    colors: ['#C8102E', '#111111', '#F5F5F5'],
    colorNames: ['Chicago', 'Black', 'White'],
    sizes: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13],
    rating: 4.9, numReviews: 5821, reviews: [], featured: true,
  },
  {
    name: 'JEYP Pegasus 41',
    slug: 'nike-pegasus-41',
    subtitle: 'Every Run, Every Pace',
    description: "The JEYP Pegasus 41 continues the legacy with updated cushioning and breathable mesh for a smooth ride.",
    price: 6595,
    salePrice: null,
    category: 'men',
    sport: 'Running',
    badge: null,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80',
    colors: ['#4FC3F7', '#111111', '#A5D6A7'],
    colorNames: ['Blue', 'Black', 'Green'],
    sizes: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    rating: 4.7, numReviews: 3104, reviews: [], featured: true,
  },
  {
    name: 'JEYP Dunk Low',
    slug: 'nike-dunk-low',
    subtitle: 'Classic Court Style',
    description: 'Created for the hardwood but taken to the streets, the JEYP Dunk Low returns with crisp overlays and classic color-blocking.',
    price: 5995,
    salePrice: null,
    category: 'women',
    sport: 'Lifestyle',
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80',
    colors: ['#FFF9C4', '#FFCC02', '#111111'],
    colorNames: ['Citron', 'Yellow', 'Black'],
    sizes: [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10],
    rating: 4.9, numReviews: 7832, reviews: [], featured: true,
  },
  {
    name: 'JEYP LBJ XXIII Elite',
    slug: 'lebron-xxiii',
    subtitle: 'Good Intentions',
    description: 'The JEYP LBJ XXIII Elite features Air Max cushioning and a supportive upper designed for elite-level play.',
    price: 13995,
    salePrice: null,
    category: 'men',
    sport: 'Basketball',
    badge: 'New',
    image: 'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=600&q=80',
    colors: ['#8BC34A', '#111111', '#FFC107'],
    colorNames: ['Honor', 'Black', 'Gold'],
    sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13, 14],
    rating: 4.8, numReviews: 1203, reviews: [], featured: true,
  },
  {
    name: "JEYP Air Force 1 '07",
    slug: 'nike-air-force-1',
    subtitle: 'The Icon Lives On',
    description: "The radiance lives on in the JEYP Air Force 1 '07, the basketball original that puts a fresh spin on what you know best.",
    price: 5495,
    salePrice: 3995,
    category: 'women',
    sport: 'Lifestyle',
    badge: 'Sale',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80',
    colors: ['#FFFFFF', '#111111', '#E8D5B7'],
    colorNames: ['White', 'Black', 'Sail'],
    sizes: [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10],
    rating: 4.9, numReviews: 11230, reviews: [], featured: false,
  },
  {
    name: 'JEYP Vomero 17',
    slug: 'nike-vomero-17',
    subtitle: 'Maximum Comfort',
    description: 'The JEYP Vomero 17 features thick ZoomX foam for all-day comfort.',
    price: 8495,
    salePrice: null,
    category: 'men',
    sport: 'Running',
    badge: null,
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80',
    colors: ['#B3E5FC', '#FFFFFF', '#111111'],
    colorNames: ['Blue Tint', 'White', 'Black'],
    sizes: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13],
    rating: 4.6, numReviews: 892, reviews: [], featured: false,
  },
  {
    name: 'JEYP Zenvy Leggings',
    slug: 'nike-zenvy',
    subtitle: 'Freedom to Flow',
    description: 'JEYP Zenvy Leggings offer gentle compression and buttery-soft fabric for every workout.',
    price: 3595,
    salePrice: 2695,
    category: 'women',
    sport: 'Training',
    badge: 'Sale',
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80',
    colors: ['#111111', '#5D4037', '#880E4F'],
    colorNames: ['Black', 'Brown', 'Plum'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    rating: 4.7, numReviews: 3421, reviews: [], featured: false,
  },
  {
    name: 'JEYP KD17',
    slug: 'nike-kd17',
    subtitle: 'Kevin Durant Signature',
    description: 'Built for elite play with React cushioning for responsive energy return.',
    price: 9995,
    salePrice: null,
    category: 'men',
    sport: 'Basketball',
    badge: null,
    image: 'https://images.unsplash.com/photo-1553545985-1e0d8781d5db?w=600&q=80',
    colors: ['#FF6F00', '#111111', '#1A237E'],
    colorNames: ['Orange', 'Black', 'Navy'],
    sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13, 14],
    rating: 4.7, numReviews: 2187, reviews: [], featured: false,
  },
  {
    name: 'JEYP ACG Zoom Gaiadome',
    slug: 'nike-acg-boots',
    subtitle: 'Gear Up, Get Lost',
    description: "JEYP ACG's most protective boot yet, combining trail traction with lifestyle aesthetics.",
    price: 9495,
    salePrice: null,
    category: 'men',
    sport: 'Lifestyle',
    badge: 'New',
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&q=80',
    colors: ['#4CAF50', '#111111', '#795548'],
    colorNames: ['Green', 'Black', 'Brown'],
    sizes: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    rating: 4.5, numReviews: 641, reviews: [], featured: false,
  },
  {
    name: "JEYP Blazer Mid '77",
    slug: 'nike-blazer-mid',
    subtitle: 'Vintage. Reborn.',
    description: "The JEYP Blazer Mid '77 sports a vintage look with modern construction.",
    price: 4995,
    salePrice: 3795,
    category: 'women',
    sport: 'Lifestyle',
    badge: 'Sale',
    image: 'https://images.unsplash.com/photo-1584735175315-9d5df23be620?w=600&q=80',
    colors: ['#FFFFFF', '#FFF9C4', '#FFE0B2'],
    colorNames: ['White', 'Lemon', 'Peach'],
    sizes: [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10],
    rating: 4.8, numReviews: 4502, reviews: [], featured: false,
  },
  {
    name: 'JEYP Stellar Ride Kids',
    slug: 'nike-stellar-ride-kids',
    subtitle: 'Race Leader Starter Pack',
    description: 'Built for little runners with big dreams - cushioned soles and easy straps.',
    price: 2995,
    salePrice: null,
    category: 'kids',
    sport: 'Running',
    badge: 'New',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    colors: ['#42A5F5', '#EF5350', '#66BB6A'],
    colorNames: ['Blue', 'Red', 'Green'],
    sizes: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6],
    rating: 4.9, numReviews: 1823, reviews: [], featured: false,
  },
];

const seed = async () => {
  await connectDB();

  console.log('🌱 Seeding database...');

  await Product.deleteMany({});
  await User.deleteMany({});

  await Product.insertMany(products);
  console.log(`✅ ${products.length} products inserted`);

  // 1. Buyer User (pre-verified for testing)
  await User.create({
    firstName: 'Test',
    lastName: 'Buyer',
    email: 'buyer@jeyp.com',
    phone: '+1-555-0002',
    password: 'buyer123456',
    role: 'buyer',
    isVerified: true,
  });
  console.log('✅ Buyer user created: buyer@jeyp.com / password: buyer123456 (email pre-verified)');

  // 2. Admin User (pre-verified for testing)
  await User.create({
    firstName: 'JEYP',
    lastName: 'Admin',
    email: 'admin@jeyp.com',
    phone: '+1-555-0001',
    password: 'admin123456',
    role: 'admin',
    isVerified: true,
  });
  console.log('✅ Admin user created: admin@jeyp.com / password: admin123456 (email pre-verified)');

  console.log('\n🎉 Seed complete!');
  console.log('\n📋 Test Credentials:');
  console.log('  Buyer:  buyer@jeyp.com / buyer123456');
  console.log('  Admin:  admin@jeyp.com / admin123456');
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});