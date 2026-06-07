const express = require('express');
const router  = express.Router();
const User    = require('../auth/User');
const Order   = require('../orders/Orders');
const Product = require('../products/Products');
const { protect, adminOnly } = require('../../middleware/auth');

router.use(protect, adminOnly);

// ─── STATS ────────────────────────────────────────────────────────
router.get('/stats', async (req, res, next) => {
  try {
    const [totalUsers, totalOrders, totalProducts, revenueAgg, recentOrders, pendingOrders,
           lowStockProducts, outOfStockProducts, monthlySales] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'firstName lastName email'),
      Order.countDocuments({ orderStatus: 'pending' }),
      Product.countDocuments({ isActive: true, stock: { $gt: 0, $lte: 10 } }),
      Product.countDocuments({ isActive: true, stock: 0 }),
      Order.aggregate([
        { $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          revenue: { $sum: '$total' }, orders: { $sum: 1 }
        }},
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 }
      ]),
    ]);
    res.json({ success: true, stats: {
      totalUsers, totalOrders, totalProducts, pendingOrders,
      lowStockProducts, outOfStockProducts,
      totalRevenue: revenueAgg[0]?.total || 0,
      recentOrders,
      monthlySales: monthlySales.reverse(),
    }});
  } catch (err) { next(err); }
});

// ─── USERS ───────────────────────────────────────────────────────
router.get('/users', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const filter = {};
    if (search) filter.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName:  { $regex: search, $options: 'i' } },
      { email:     { $regex: search, $options: 'i' } },
    ];
    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(filter),
    ]);
    res.json({ success: true, total, users });
  } catch (err) { next(err); }
});

// FIX 10: Protect role changes — prevent self-demotion and superadmin guard
router.put('/users/:id/role', async (req, res, next) => {
  try {
    const { role } = req.body;
    const validRoles = ['buyer', 'admin', 'superadmin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role.' });
    }

    // Prevent self-demotion
    if (req.params.id === req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You cannot change your own role.' });
    }

    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ success: false, message: 'User not found.' });

    // Only superadmin can demote other admins or assign superadmin role
    if ((target.role === 'superadmin' || target.role === 'admin' || role === 'superadmin') &&
        req.user.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Only superadmin can modify admin roles.' });
    }

    target.role = role;
    await target.save();
    res.json({ success: true, user: target });
  } catch (err) { next(err); }
});

// ─── INVENTORY ───────────────────────────────────────────────────
router.get('/inventory', async (req, res, next) => {
  try {
    const { filter = 'all' } = req.query;
    let match = { isActive: true };
    if (filter === 'low')  match = { isActive: true, stock: { $gt: 0, $lte: 10 } };
    if (filter === 'out')  match = { isActive: true, stock: 0 };
    if (filter === 'ok')   match = { isActive: true, stock: { $gt: 10 } };
    const products = await Product.find(match).select('name image slug stock lowStockThreshold category sport badge isActive').sort({ stock: 1 });
    res.json({ success: true, products });
  } catch (err) { next(err); }
});

router.put('/inventory/:id', async (req, res, next) => {
  try {
    const { adjustment, reason } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    const before = product.stock;
    const after  = Math.max(0, before + Number(adjustment));
    product.stock = after;
    product.stockHistory.push({ change: Number(adjustment), reason: reason || 'Manual adjustment', before, after, changedBy: req.user._id });
    await product.save();
    res.json({ success: true, product });
  } catch (err) { next(err); }
});

router.get('/inventory/:id/history', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).select('name stockHistory').populate('stockHistory.changedBy', 'firstName lastName');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, history: product.stockHistory.reverse() });
  } catch (err) { next(err); }
});

// ─── ANALYTICS ───────────────────────────────────────────────────
router.get('/analytics', async (req, res, next) => {
  try {
    const [monthlySales, topProducts, ordersByStatus, revenueByPayment] = await Promise.all([
      Order.aggregate([
        { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } }, { $limit: 12 }
      ]),
      Order.aggregate([
        { $unwind: '$items' },
        { $group: { _id: '$items.product', name: { $first: '$items.name' }, image: { $first: '$items.image' }, totalSold: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
        { $sort: { totalSold: -1 } }, { $limit: 5 }
      ]),
      Order.aggregate([{ $group: { _id: '$orderStatus', count: { $sum: 1 } } }]),
      Order.aggregate([{ $group: { _id: '$paymentMethod', total: { $sum: '$total' }, count: { $sum: 1 } } }]),
    ]);
    res.json({ success: true, analytics: { monthlySales, topProducts, ordersByStatus, revenueByPayment } });
  } catch (err) { next(err); }
});

module.exports = router;
