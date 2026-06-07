const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 50 },
    lastName:  { type: String, required: true, trim: true, maxlength: 50 },
    email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone:     { type: String, trim: true },
    password:  { type: String, required: true, minlength: 6, select: false },
    role:      { type: String, enum: ['buyer', 'admin', 'superadmin'], default: 'buyer' },

    // Email verification
    isVerified:       { type: Boolean, default: false },
    verifyCode:       { type: String, select: false },
    verifyCodeExpiry: { type: Date,   select: false },

    // FIX 4: Password reset
    resetCode:        { type: String, select: false },
    resetCodeExpiry:  { type: Date,   select: false },

    wishlist:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    addresses: [{
      label: String, street: String, city: String,
      province: String, zip: String, isDefault: { type: Boolean, default: false },
    }],
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('User', userSchema);
