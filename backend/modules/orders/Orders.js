const mongoose = require('mongoose');

// 1. Counter Schema to handle unique auto-increment sequences safely
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

// Create the model if it hasn't been compiled yet
const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

// 2. Order Item Schema
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: String,
  image: String,
  price: { type: Number, required: true },
  size: mongoose.Schema.Types.Mixed,
  color: String,
  quantity: { type: Number, required: true, min: 1 },
});

// 3. Main Order Schema
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null = guest checkout
    },
    guestEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    orderNumber: {
      type: String,
      unique: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      street: String,
      city: String,
      province: String,
      zip: String,
    },
    paymentMethod: {
      type: String,
      enum: ['Credit / Debit Card', 'GCash', 'PayMaya', 'Cash on Delivery'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    notes: String,
    deliveredAt: Date,
  },
  { timestamps: true }
);

// 4. ATOMIC Pre-save hook: Increments a tracking counter instead of using .countDocuments()
orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'orderNumberSequence' }, 
        { $inc: { seq: 1 } },           // Atomically locks and increments counter
        { new: true, upsert: true }     // Creates the counter document if it doesn't exist yet
      );

      // Pads out the number to 6 spaces, e.g., JEYP-000001, JEYP-000002
      this.orderNumber = `JEYP-${String(counter.seq).padStart(6, '0')}`;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('Order', orderSchema);