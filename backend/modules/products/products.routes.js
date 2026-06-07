const express = require('express');
const router  = express.Router();
const ctrl    = require('./products.controller');
const Product = require('./Products');
const { protect, adminOnly } = require('../../middleware/auth');

// Public
router.get('/',           ctrl.getProducts);
router.get('/featured',   ctrl.getFeatured);
router.get('/slug/:slug', ctrl.getBySlug);

// Reviews (must be before /:id to avoid conflict)
router.get('/:id/reviews', async (req, res, next) => {
  try {
    const { id } = req.params;

    // FIX: Validate that id is a proper MongoDB ObjectId before querying
    if (!id || id === 'undefined' || !/^[a-f\d]{24}$/i.test(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID.' });
    }

    const product = await Product.findById(id).select('reviews rating numReviews');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    res.json({
      success: true,
      reviews: product.reviews,
      rating: product.rating,
      numReviews: product.numReviews,
    });
  } catch (err) { next(err); }
});

router.post('/:id/reviews', protect, async (req, res, next) => {
  try {
    const { id } = req.params;

    // FIX: Validate that id is a proper MongoDB ObjectId before querying
    if (!id || id === 'undefined' || !/^[a-f\d]{24}$/i.test(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID.' });
    }

    const { rating, title, body } = req.body;

    // Validate required fields
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5.' });
    }
    if (!body || !body.trim()) {
      return res.status(400).json({ success: false, message: 'Review body is required.' });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    const existingIdx = product.reviews.findIndex(r => r.user.toString() === req.user._id.toString());

    if (existingIdx !== -1) {
      // Update existing review
      product.reviews[existingIdx].rating = Number(rating);
      product.reviews[existingIdx].title  = title?.trim() || '';
      product.reviews[existingIdx].body   = body.trim();
    } else {
      // Add new review
      product.reviews.push({
        user: req.user._id,
        userName: `${req.user.firstName} ${req.user.lastName}`,
        rating: Number(rating),
        title: title?.trim() || '',
        body: body.trim(),
      });
    }

    // Recompute average from all reviews
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;

    await product.save();

    res.status(200).json({
      success: true,
      message: existingIdx !== -1 ? 'Review updated.' : 'Review added.',
      rating: product.rating,
      numReviews: product.numReviews,
    });
  } catch (err) { next(err); }
});

router.get('/:id', ctrl.getById);

// Admin only
router.post('/',      protect, adminOnly, ctrl.createProduct);
router.put('/:id',    protect, adminOnly, ctrl.updateProduct);
router.delete('/:id', protect, adminOnly, ctrl.deleteProduct);

module.exports = router;