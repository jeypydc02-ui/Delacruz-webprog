const User = require('./User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateOTP, sendVerificationEmail, sendPasswordResetEmail } = require('./email.service');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET environment variable is required');

const signToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// Step 1: Register
const registerUser = async (email, password, firstName, lastName, phone) => {
  const existing = await User.findOne({ email });
  if (existing && existing.isVerified) throw new Error('Email already registered.');

  const code = generateOTP();
  const expiry = new Date(Date.now() + 10 * 60 * 1000);

  if (existing && !existing.isVerified) {
    existing.firstName = firstName; existing.lastName = lastName;
    existing.phone = phone; existing.password = password;
    existing.verifyCode = code; existing.verifyCodeExpiry = expiry;
    await existing.save();
  } else {
    await User.create({ firstName, lastName, email, phone, password,
      verifyCode: code, verifyCodeExpiry: expiry, isVerified: false });
  }

  await sendVerificationEmail(email, firstName, code);
  return { message: 'Verification code sent to your email.' };
};

// Step 2: Verify OTP
const verifyEmail = async (email, code) => {
  const user = await User.findOne({ email }).select('+verifyCode +verifyCodeExpiry');
  if (!user) throw new Error('User not found.');
  if (user.isVerified) throw new Error('Email already verified.');
  if (!user.verifyCode || user.verifyCode !== code) throw new Error('Invalid verification code.');
  if (user.verifyCodeExpiry < new Date()) throw new Error('Code expired. Please register again.');

  user.isVerified = true; user.verifyCode = undefined; user.verifyCodeExpiry = undefined;
  await user.save();

  const token = signToken(user._id);
  return { token, user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } };
};

// Resend OTP
const resendVerification = async (email) => {
  const user = await User.findOne({ email }).select('+verifyCode +verifyCodeExpiry');
  if (!user) throw new Error('User not found.');
  if (user.isVerified) throw new Error('Email already verified.');

  const code = generateOTP();
  const expiry = new Date(Date.now() + 10 * 60 * 1000);
  user.verifyCode = code; user.verifyCodeExpiry = expiry;
  await user.save();
  await sendVerificationEmail(email, user.firstName, code);
  return { message: 'New verification code sent.' };
};

// Login
const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new Error('Invalid email or password.');
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid email or password.');
  if (!user.isVerified) throw new Error('Please verify your email before logging in.');

  const token = signToken(user._id);
  return { token, user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } };
};

const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new Error('User not found.');
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new Error('Incorrect current password.');
  user.password = newPassword;
  await user.save();
  return { message: 'Password updated successfully.' };
};

// FIX 4: Forgot password — send reset OTP
const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  // Always return same message to prevent email enumeration
  if (!user || !user.isVerified) {
    return { message: 'If that email exists, a reset code has been sent.' };
  }

  const code = generateOTP();
  const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min
  user.resetCode = code;
  user.resetCodeExpiry = expiry;
  await user.save();

  await sendPasswordResetEmail(email, user.firstName, code);
  return { message: 'If that email exists, a reset code has been sent.' };
};

// FIX 4: Reset password with OTP
const resetPassword = async (email, code, newPassword) => {
  const user = await User.findOne({ email }).select('+resetCode +resetCodeExpiry');
  if (!user) throw new Error('Invalid or expired reset code.');
  if (!user.resetCode || user.resetCode !== code) throw new Error('Invalid or expired reset code.');
  if (user.resetCodeExpiry < new Date()) throw new Error('Reset code has expired. Please request a new one.');

  user.password = newPassword;
  user.resetCode = undefined;
  user.resetCodeExpiry = undefined;
  await user.save();
  return { message: 'Password reset successfully. You can now log in.' };
};

module.exports = { registerUser, verifyEmail, resendVerification, loginUser, changePassword, forgotPassword, resetPassword };
