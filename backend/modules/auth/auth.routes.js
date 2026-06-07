const express    = require('express');
const router     = express.Router();
const ctrl       = require('./auth.controller');
const { protect } = require('../../middleware/auth');
const rateLimit  = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 10,
  standardHeaders: true, legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Please try again in 15 minutes.' },
});

const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, max: 5,
  standardHeaders: true, legacyHeaders: false,
  message: { success: false, message: 'Too many OTP requests. Please try again in 1 hour.' },
});

router.post('/register',        authLimiter, ctrl.register);
router.post('/verify-email',    authLimiter, ctrl.verifyEmail);
router.post('/resend-code',     otpLimiter,  ctrl.resendCode);
router.post('/login',           authLimiter, ctrl.login);
router.post('/forgot-password', otpLimiter,  ctrl.forgotPassword);
router.post('/reset-password',  authLimiter, ctrl.resetPassword);
router.get('/me',   protect,   ctrl.getMe);
router.put('/me',   protect,   ctrl.updateMe);
router.put('/change-password', protect, ctrl.changePassword);

// Wishlist routes (per-user, stored in DB)
const User = require('./User');
router.get('/wishlist', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    res.json({ success: true, wishlist: user.wishlist || [] });
  } catch (err) { next(err); }
});

router.post('/wishlist/toggle', protect, async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ success: false, message: 'productId required' });
    const user = await User.findById(req.user.id);
    const idx = user.wishlist.findIndex(id => id.toString() === productId);
    if (idx > -1) {
      user.wishlist.splice(idx, 1);
    } else {
      user.wishlist.push(productId);
    }
    await user.save();
    const updated = await User.findById(req.user.id).populate('wishlist');
    res.json({ success: true, wishlist: updated.wishlist, wishlisted: idx === -1 });
  } catch (err) { next(err); }
});

module.exports = router;
