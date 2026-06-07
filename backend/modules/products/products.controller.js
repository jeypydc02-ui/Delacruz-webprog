const Product = require('./Products');

exports.getProducts = async (req, res, next) => {
  try {
    const { category, sport, sort, search, featured, page = 1, limit = 20 } = req.query;
    const filter = { isActive: true };
    if (category && category !== 'all') {
      if (category === 'sale') filter.salePrice = { $ne: null, $gt: 0 };
      else filter.category = category;
    }
    if (sport) filter.sport = sport;
    if (featured === 'true') filter.featured = true;
    if (search) filter.$text = { $search: search };
    const sortMap = {
      'price-asc': { price: 1 }, 'price-desc': { price: -1 },
      'rating': { rating: -1 }, 'reviews': { numReviews: -1 },
      'newest': { createdAt: -1 }, 'featured': { featured: -1, createdAt: -1 },
    };
    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortMap[sort] || sortMap['featured']).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);
    res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / Number(limit)), products });
  } catch (err) { next(err); }
};

exports.getFeatured = async (req, res, next) => {
  try {
    const products = await Product.find({ featured: true, isActive: true }).sort({ createdAt: -1 }).limit(10);
    res.json({ success: true, products });
  } catch (err) { next(err); }
};

exports.getBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, product });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, product });
  } catch (err) { next(err); }
};

exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (err) { next(err); }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, product });
  } catch (err) { next(err); }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, message: 'Product deactivated.' });
  } catch (err) { next(err); }
};
