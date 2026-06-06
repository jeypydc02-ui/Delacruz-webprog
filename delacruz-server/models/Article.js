const mongoose = require('mongoose');
const articleSchema = new mongoose.Schema({
  slug:       { type: String, required: true, unique: true },
  title:      { type: String, required: true },
  paragraphs: { type: [String], default: [] },
  preview:    { type: String, default: '' },
  imageUrl:   { type: String, default: '' },
  isActive:   { type: Boolean, default: true },
  status:     { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });
module.exports = mongoose.model('Article', articleSchema);
