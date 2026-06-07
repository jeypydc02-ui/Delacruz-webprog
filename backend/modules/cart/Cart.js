const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One cart per user
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, 'Quantity cannot be less than 1.'],
          default: 1,
        },
        color: String, // Optional: if buyers pick a color
        size: mongoose.Schema.Types.Mixed, // Handles numbers or strings like 'XL'
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);