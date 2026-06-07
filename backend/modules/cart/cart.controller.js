const Cart = require('./Cart');
const Product = require('../products/Products');

// GET /api/cart
exports.getCart = async (req, res, next) => {
  try {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    res.json({ success: true, cart: cart || { items: [] } });
  } catch (err) { next(err); }
};

// POST /api/cart  — add or update item
exports.addItem = async (req, res, next) => {
  try {
    const { productId, quantity = 1, color, size } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    // FIX 3: Stock check on add
    if (product.stock <= 0) {
      return res.status(400).json({ success: false, message: `"${product.name}" is out of stock.` });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    const currentQtyInCart = (() => {
      if (!cart) return 0;
      const idx = cart.items.findIndex(
        (i) => i.product.toString() === productId && i.color === color && String(i.size) === String(size)
      );
      return idx > -1 ? cart.items[idx].quantity : 0;
    })();

    const newTotal = currentQtyInCart + quantity;
    if (newTotal > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} item(s) available. You already have ${currentQtyInCart} in your cart.`,
      });
    }

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [{ product: productId, quantity, color, size }] });
    } else {
      const idx = cart.items.findIndex((i) => i.product.toString() === productId && i.color === color && String(i.size) === String(size));
      if (idx > -1) cart.items[idx].quantity += quantity;
      else cart.items.push({ product: productId, quantity, color, size });
      await cart.save();
    }

    const populated = await cart.populate('items.product');
    res.json({ success: true, cart: populated });
  } catch (err) { next(err); }
};

// PUT /api/cart/:itemId
exports.updateItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found.' });
    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });

    // FIX 3: Stock check on update
    if (quantity > 1) {
      const product = item.product;
      if (product && quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} item(s) available for "${product.name}".`,
        });
      }
    }

    if (quantity < 1) cart.items.pull(req.params.itemId);
    else item.quantity = quantity;
    await cart.save();
    const populated = await cart.populate('items.product');
    res.json({ success: true, cart: populated });
  } catch (err) { next(err); }
};

// DELETE /api/cart/:itemId
exports.removeItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found.' });
    cart.items.pull(req.params.itemId);
    await cart.save();
    const populated = await cart.populate('items.product');
    res.json({ success: true, cart: populated });
  } catch (err) { next(err); }
};

// DELETE /api/cart
exports.clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndDelete({ user: req.user.id });
    res.json({ success: true, message: 'Cart cleared.' });
  } catch (err) { next(err); }
};
