const mongoose = require('mongoose');

const stockHistorySchema = new mongoose.Schema({
  change:  { type: Number, required: true },
  reason:  { type: String, default: 'Manual adjustment' },
  before:  { type: Number, required: true },
  after:   { type: Number, required: true },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const reviewSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  rating:   { type: Number, required: true, min: 1, max: 5 },
  title:    { type: String, trim: true },
  body:     { type: String, required: true, trim: true },
  verified: { type: Boolean, default: false },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  slug:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  subtitle:    { type: String, trim: true },
  description: { type: String, required: true },
  materials:   { type: String, default: '' },
  careInstructions: { type: String, default: '' },
  price:       { type: Number, required: true, min: 0 },
  salePrice:   { type: Number, default: null, min: 0 },
  category:    { type: String, required: true, enum: ['men','women','kids'], lowercase: true },
  sport:       { type: String, required: true, enum: ['Running','Basketball','Football','Training','Lifestyle','Golf','Tennis','Skateboarding'] },
  badge:       { type: String, enum: ['New','Just In','Bestseller','Sale',null], default: null },
  image:       { type: String, required: true },
  images:      [String],
  colors:      [String],
  colorNames:  [String],
  sizes:       [mongoose.Schema.Types.Mixed],
  rating:      { type: Number, default: 0, min: 0, max: 5 },
  numReviews:  { type: Number, default: 0 },
  reviews:     [reviewSchema],
  featured:    { type: Boolean, default: false },
  stock:       { type: Number, default: 100, min: 0 },
  lowStockThreshold: { type: Number, default: 10 },
  stockHistory: [stockHistorySchema],
  isActive:    { type: Boolean, default: true },
  tags:        [String],
  shippingWeight: { type: Number, default: 0.5 },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

productSchema.index({ category: 1, sport: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ stock: 1 });
productSchema.index({ name: 'text', subtitle: 'text', description: 'text', tags: 'text' });

productSchema.virtual('discountPercent').get(function() {
  if (!this.salePrice) return 0;
  return Math.round(((this.price - this.salePrice) / this.price) * 100);
});
productSchema.virtual('displayPrice').get(function() { return this.salePrice || this.price; });
productSchema.virtual('isLowStock').get(function() { return this.stock > 0 && this.stock <= this.lowStockThreshold; });
productSchema.virtual('isOutOfStock').get(function() { return this.stock === 0; });

module.exports = mongoose.model('Product', productSchema);
