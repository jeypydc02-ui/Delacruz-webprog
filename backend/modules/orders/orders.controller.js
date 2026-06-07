const Order   = require('./Orders');
const Cart    = require('../cart/Cart');
const Product = require('../products/Products');
const { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail } = require('../auth/email.service');

// Helper: atomically decrement stock for all order items
const decrementStock = async (orderItems) => {
  await Promise.all(
    orderItems.map(({ product: productId, quantity }) =>
      Product.findByIdAndUpdate(productId, { $inc: { stock: -quantity } })
    )
  );
};

// POST /api/orders/checkout  (logged-in)
exports.createOrderFromCart = async (req, res, next) => {
  try {
    // Block admins from placing orders
    if (req.user.role === 'admin' || req.user.role === 'superadmin') {
      return res.status(403).json({ success: false, message: 'Admin accounts cannot place orders.' });
    }

    const { shippingAddress, paymentMethod, notes } = req.body;
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || !cart.items.length)
      return res.status(400).json({ success: false, message: 'Your cart is empty.' });

    // Validate stock before creating order
    const stockErrors = [];
    for (const item of cart.items) {
      const product = item.product;
      if (!product) {
        stockErrors.push(`A product in your cart no longer exists.`);
        continue;
      }
      if (product.stock < item.quantity) {
        stockErrors.push(
          product.stock === 0
            ? `"${product.name}" is out of stock.`
            : `"${product.name}" only has ${product.stock} item(s) left (you requested ${item.quantity}).`
        );
      }
    }
    if (stockErrors.length > 0) {
      return res.status(400).json({ success: false, message: stockErrors.join(' ') });
    }

    let subtotal = 0;
    const orderItems = cart.items.map((item) => {
      const price = item.product.salePrice || item.product.price;
      subtotal += price * item.quantity;
      return {
        product: item.product._id, name: item.product.name,
        image: item.product.image, price, size: item.size,
        color: item.color, quantity: item.quantity,
      };
    });

    const order = await Order.create({
      user: req.user.id, items: orderItems, shippingAddress,
      paymentMethod, subtotal, shippingFee: 0, total: subtotal, notes,
    });

    await decrementStock(orderItems);
    await Cart.findOneAndDelete({ user: req.user.id });

    // Send order confirmation email
    const emailTo = shippingAddress?.email || req.user.email;
    const firstName = shippingAddress?.firstName || req.user.firstName;
    try {
      await sendOrderConfirmationEmail(emailTo, firstName, order);
    } catch (emailErr) {
      console.error('Order confirmation email failed:', emailErr.message);
    }

    res.status(201).json({ success: true, order });
  } catch (err) { next(err); }
};

// GET /api/orders/my-orders
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 }).populate('items.product', 'name image slug');
    res.json({ success: true, orders });
  } catch (err) { next(err); }
};

// GET /api/orders/:id
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name image slug');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin' && order.user?.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Access denied.' });
    res.json({ success: true, order });
  } catch (err) { next(err); }
};

// GET /api/orders  (admin)
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.orderStatus = status;
    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).populate('user', 'firstName lastName email'),
      Order.countDocuments(filter),
    ]);
    res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / Number(limit)), orders });
  } catch (err) { next(err); }
};

// PUT /api/orders/:id/status  (admin)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const update = {};
    if (orderStatus) update.orderStatus = orderStatus;
    if (paymentStatus) update.paymentStatus = paymentStatus;
    if (orderStatus === 'delivered') update.deliveredAt = new Date();
    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true }).populate('user', 'firstName lastName email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    // Send status update email if orderStatus changed
    if (orderStatus) {
      const emailTo = order.user?.email || order.shippingAddress?.email || order.guestEmail;
      const firstName = order.user?.firstName || order.shippingAddress?.firstName || 'Customer';
      if (emailTo) {
        try {
          await sendOrderStatusUpdateEmail(emailTo, firstName, order, orderStatus);
        } catch (emailErr) {
          console.error('Status update email failed:', emailErr.message);
        }
      }
    }

    res.json({ success: true, order });
  } catch (err) { next(err); }
};

// GET /api/orders/stats  (admin)
exports.getStats = async (req, res, next) => {
  try {
    const [totalOrders, totalRevenue, pending, delivered] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
      Order.countDocuments({ orderStatus: 'pending' }),
      Order.countDocuments({ orderStatus: 'delivered' }),
    ]);
    res.json({ success: true, stats: { totalOrders, totalRevenue: totalRevenue[0]?.total || 0, pending, delivered } });
  } catch (err) { next(err); }
};
