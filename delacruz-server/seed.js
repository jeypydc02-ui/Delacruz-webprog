/**
 * seed.js  –  run once to insert the required credentials into MongoDB
 * Usage:  node seed.js
 *
 * Make sure MONGO_URI in .env is set to your Atlas connection string first.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User     = require('./models/User');

const users = [
  {
    firstName:     'Alicia',
    lastName:      'Reyes',
    age:           '29',
    gender:        'female',
    contactNumber: '09171234567',
    email:         'alicia.reyes@robles.dev',
    type:          'admin',
    username:      'aliciareyes',
    password:      'Alicia123!',
    address:       'Sampaloc, Manila, Metro Manila',
    isActive:      true,
  },
  {
    firstName:     'John Paul',
    lastName:      'Dela Cruz',
    age:           '21',
    gender:        'male',
    contactNumber: '09933570665',
    email:         'jeyp@gnail.com',
    type:          'editor',
    username:      'jeypdcccd',
    password:      'jeyp123!',
    address:       'Old Boso Boso, Antipolo City',
    isActive:      true,
  },
  {
    firstName:     'Zere',
    lastName:      'User',
    age:           '20',
    gender:        'male',
    contactNumber: '09171234568',
    email:         'zere@gmail.com',
    type:          'viewer',
    username:      'zereuser',
    password:      'zere123!',
    address:       'Quezon City, Metro Manila',
    isActive:      true,
  },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    for (const u of users) {
      const exists = await User.findOne({ email: u.email });
      if (exists) {
        console.log(`  SKIP  ${u.email}  (already exists)`);
        continue;
      }
      const hashed = await bcrypt.hash(u.password, 10);
      await User.create({ ...u, password: hashed });
      console.log(`  ADDED ${u.email}  [${u.type}]`);
    }

    console.log('\nSeed complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
})();
