require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const morgan   = require('morgan');
const mongoose = require('mongoose');
const connectDB     = require('./config/db');
const errorHandler  = require('./middleware/errorHandler');
const authRoutes    = require('./modules/auth/auth.routes');
const productRoutes = require('./modules/products/products.routes');
const orderRoutes   = require('./modules/orders/orders.routes');
const cartRoutes    = require('./modules/cart/cart.routes');
const adminRoutes   = require('./modules/admin/admin.routes');

connectDB();
const app = express();

app.use(cors({
  origin: [process.env.CLIENT_URL || 'http://localhost:5173', /\.vercel\.app$/],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/cart',     cartRoutes);
app.use('/api/admin',    adminRoutes);

app.get('/api/health', (req, res) => {
  const states = ['disconnected','connected','connecting','disconnecting'];
  res.json({ success: true, message: 'JEYP Store API running', db: states[mongoose.connection.readyState] });
});

app.use('/api/*', (req, res) => res.status(404).json({ success: false, message: 'Route not found.' }));
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`\n🚀 JEYP API → http://localhost:${PORT}\n`));
module.exports = app;
